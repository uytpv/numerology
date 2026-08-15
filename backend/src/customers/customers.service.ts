import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { AIService } from '../ai/ai.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { calculateNumerologyMap } from '../utils/numerology';

@Injectable()
export class CustomersService {
  constructor(
    private firebaseService: FirebaseService,
    private aiService: AIService,
  ) {}

  /**
   * Tạo khách hàng tra cứu mới hoặc trả về bản ghi cũ nếu đã tồn tại trùng khớp
   */
  async create(dto: CreateCustomerDto, userId: string): Promise<any> {
    const db = this.firebaseService.db();
    const cleanDob = dto.dob.replace(/-/g, '/');

    // Kiểm tra xem khách hàng này đã tồn tại đối với User này chưa
    const existingSnapshot = await db.collection('customers')
      .where('userId', '==', userId)
      .where('first_name', '==', dto.first_name)
      .where('last_name', '==', dto.last_name)
      .where('dob', '==', cleanDob)
      .limit(1)
      .get();

    if (!existingSnapshot.empty) {
      const doc = existingSnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }

    // Tính toán bản đồ thần số học
    const map = calculateNumerologyMap({
      first_name: dto.first_name,
      last_name: dto.last_name,
      dob: cleanDob
    });

    const newCustomer = {
      first_name: dto.first_name,
      last_name: dto.last_name,
      dob: cleanDob,
      userId: userId,
      map: map,
      reports: {}, // Cache chứa báo cáo AI phân tích theo từng tier
      unlockedTier: 0, // Mặc định là Tier 0 (Free)
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Lưu trữ vào Firestore
    const docRef = await db.collection('customers').add(newCustomer);
    
    return { id: docRef.id, ...newCustomer };
  }

  /**
   * Tìm kiếm thông tin khách hàng cụ thể theo ID
   */
  async findOne(id: string, userId: string, isAdmin: boolean = false): Promise<any> {
    const db = this.firebaseService.db();
    const doc = await db.collection('customers').doc(id).get();

    if (!doc.exists) {
      throw new NotFoundException('Không tìm thấy thông tin khách hàng');
    }

    const data = doc.data() as any;
    // Bảo vệ dữ liệu theo chuẩn UyFullStack: Chỉ chính chủ hoặc Admin được xem
    if (!isAdmin && data && data.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền truy cập thông tin khách hàng này');
    }

    return { id: doc.id, ...data };
  }

  /**
   * Lấy báo cáo AI phân tích chi tiết. Có cơ chế caching tránh gọi API nhiều lần tốn phí
   */
  async getAIReport(customerId: string, tier: number, language: string, userId: string, isAdmin: boolean = false): Promise<any> {
    const customer = await this.findOne(customerId, userId, isAdmin);

    // Xác minh quyền truy cập theo cấp độ thanh toán (Tier)
    if (!isAdmin && customer.unlockedTier < tier) {
      throw new ForbiddenException(
        `Báo cáo cấp độ Tier ${tier} chưa được mở khóa. Vui lòng thanh toán để xem chi tiết.`
      );
    }

    const reports = customer.reports || {};
    const cacheKey = `${tier}_${language}`;

    // Kiểm tra xem báo cáo đã được sinh và cache chưa
    if (reports[cacheKey]) {
      console.log(`--- SỬ DỤNG BÁO CÁO CACHED CHO TIER ${tier} [${language}] ---`);
      return reports[cacheKey];
    }

    console.log(`--- KHỞI TẠO SINH BÁO CÁO AI MỚI CHO TIER ${tier} [${language}] ---`);
    const fullName = `${customer.last_name} ${customer.first_name}`;
    
    // Gọi AI sinh luận giải
    const aiReport = await this.aiService.generatePersonalizedReport({
      fullName,
      dob: customer.dob,
      map: customer.map,
      tier,
      language
    });

    // Cập nhật lưu trữ Cache vào Firestore
    reports[cacheKey] = aiReport;
    
    const db = this.firebaseService.db();
    await db.collection('customers').doc(customerId).update({
      reports: reports,
      updatedAt: new Date().toISOString()
    });

    return aiReport;
  }

  /**
   * Mở khóa các Tier nâng cao (Sử dụng bởi hệ thống thanh toán Webhook)
   */
  async unlockTier(customerId: string, tier: number): Promise<any> {
    const db = this.firebaseService.db();
    const customerRef = db.collection('customers').doc(customerId);
    const doc = await customerRef.get();

    if (!doc.exists) {
      throw new NotFoundException('Không tìm thấy thông tin khách hàng để mở khóa');
    }

    const currentData = doc.data() as any;
    // Chỉ cập nhật nếu tier mới cao hơn tier hiện tại
    if (currentData && currentData.unlockedTier < tier) {
      await customerRef.update({
        unlockedTier: tier,
        updatedAt: new Date().toISOString()
      });
      console.log(`--- ĐÃ MỞ KHÓA TIER ${tier} CHO CUSTOMER ${customerId} ---`);
      return true;
    }

    return false;
  }
}
