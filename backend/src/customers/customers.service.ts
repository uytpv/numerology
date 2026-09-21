import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { AIService } from '../ai/ai.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { calculateNumerologyMap, parseDob, total, totalIgnoreMaster } from '../utils/numerology';

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
    const customerUserId = data?.userId || data?.user_id;
    // Bảo vệ dữ liệu theo chuẩn UyFullStack: Chỉ chính chủ hoặc Admin được xem
    if (!isAdmin && data && customerUserId && customerUserId !== userId) {
      throw new ForbiddenException('Bạn không có quyền truy cập thông tin khách hàng này');
    }

    return { id: doc.id, ...data };
  }

  /**
   * Lấy bản đồ hiển thị công khai (Public view cho khách xem qua link chia sẻ)
   * Chỉ trả về các chỉ số và báo cáo, loại bỏ thông tin riêng tư (email, phone, coachNotes)
   */
  async findPublicMap(id: string): Promise<any> {
    const db = this.firebaseService.db();
    const doc = await db.collection('customers').doc(id).get();

    if (!doc.exists) {
      throw new NotFoundException('Không tìm thấy thông tin bản đồ');
    }

    const data = doc.data() as any;
    return {
      id: doc.id,
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      dob: data.dob || '',
      gender: data.gender || 'other',
      map: data.map || {},
      reports: data.reports || {},
      unlockedTier: data.unlockedTier || 0,
      tier: data.tier || 'free',
      is_paid: Boolean(data.is_paid || data.tier === 'paid' || data.unlockedTier >= 3),
      life_focus: data.life_focus || ['career', 'money', 'love'],
      isPublicView: true,
    };
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
   * Sinh bài luận giải AI độc bản trực tiếp (Hỗ trợ cả Guest lẫn Khách đã lưu)
   */
  async generateDirectAIReport(dto: {
    fullName: string;
    dob: string;
    map: any;
    tier?: number;
    language?: string;
    readingProfile?: string;
    customerId?: string;
  }): Promise<any> {
    const { fullName, dob, map, tier = 0, language = 'vi', readingProfile = 'career', customerId } = dto;

    if (customerId) {
      const db = this.firebaseService.db();
      const docRef = db.collection('customers').doc(customerId);
      const docSnap = await docRef.get();
      if (docSnap.exists) {
        const data = docSnap.data() as any;
        const reports = data?.reports || {};
        const cacheKey = `${tier}_${language}_${readingProfile}`;
        if (reports[cacheKey]) {
          console.log(`--- [CACHE HIT] Sử dụng bài luận giải AI lưu sẵn cho ${customerId} ---`);
          return reports[cacheKey];
        }

        const aiReport = await this.aiService.generatePersonalizedReport({
          fullName,
          dob,
          map,
          tier,
          language,
          readingProfile,
        });

        reports[cacheKey] = aiReport;
        await docRef.update({
          reports,
          updatedAt: new Date().toISOString(),
        });

        return aiReport;
      }
    }

    return this.aiService.generatePersonalizedReport({
      fullName,
      dob,
      map,
      tier,
      language,
      readingProfile,
    });
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

  /**
   * Mở khóa hồ sơ khách hàng bằng 1 Credit trong tài khoản User
   */
  async unlockCustomerWithCredit(userId: string, customerId: string): Promise<any> {
    const db = this.firebaseService.db();
    const userRef = db.collection('users').doc(userId);
    const customerRef = db.collection('customers').doc(customerId);

    return db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        throw new NotFoundException('Không tìm thấy thông tin tài khoản người dùng');
      }

      const customerDoc = await transaction.get(customerRef);
      if (!customerDoc.exists) {
        throw new NotFoundException('Không tìm thấy hồ sơ bản đồ cần mở khóa');
      }

      const userData = userDoc.data() as any;
      const isVipSubscription = userData?.subscription?.status === 'ACTIVE' && userData?.subscription?.planType === 'coach_vip';
      const credits = Number(userData?.credits) || 0;

      if (!isVipSubscription && credits < 1) {
        throw new BadRequestException('Tài khoản của bạn không đủ lượt mở bài (Cần 1 lượt). Vui lòng nạp thêm lượt!');
      }

      const now = new Date().toISOString();

      // Trừ 1 credit nếu không phải gói vô hạn VIP
      if (!isVipSubscription) {
        transaction.update(userRef, {
          credits: credits - 1,
          updatedAt: now,
        });
      }

      // Mở khóa Tier 3 / VIP cho hồ sơ khách hàng
      transaction.update(customerRef, {
        unlockedTier: 3,
        tier: 'paid',
        is_paid: true,
        updatedAt: now,
      });

      console.log(`--- [CREDIT DEDUCT] User ${userId} đã dùng 1 credit để mở khóa hồ sơ ${customerId} ---`);

      return {
        success: true,
        message: 'Đã mở khóa bài luận giải thành công bằng 1 lượt!',
        remainingCredits: isVipSubscription ? 'Vô hạn' : credits - 1,
      };
    });
  }

  /**
   * Tính toán toàn bộ 21 chỉ số Pythagoras chuẩn hóa (Single Source of Truth)
   * Nhận họ tên và ngày sinh, tính toán bản đồ, timeline 7 ngày và 4 đỉnh cao
   */
  calculateFullNumerologyProfile(fullNameInput: string, dobInput: string, genderInput?: string) {
    const rawFullName = (fullNameInput || '').trim();
    const cleanDob = (dobInput || '').replace(/-/g, '/');

    // Tách first_name và last_name thông minh
    const nameParts = rawFullName.split(/\s+/).filter(Boolean);
    const firstName = nameParts.length > 0 ? nameParts[nameParts.length - 1] : '';
    const lastName = nameParts.length > 1 ? nameParts.slice(0, nameParts.length - 1).join(' ') : '';

    const map = calculateNumerologyMap({
      first_name: firstName,
      last_name: lastName,
      dob: cleanDob,
    });

    // Tính timeline 7 ngày cá nhân (3 ngày trước, hôm nay, 3 ngày sau)
    const { day, month } = parseDob(cleanDob);
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const thisYearRed = total(currentYear);
    const personalYear = totalIgnoreMaster(total(day) + total(month) + thisYearRed);
    const personalMonth = totalIgnoreMaster(personalYear + currentMonth);

    const days: any[] = [];
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    for (let offset = -3; offset <= 3; offset++) {
      const d = new Date(today);
      d.setDate(today.getDate() + offset);
      const curDate = d.getDate();
      const pDay = totalIgnoreMaster(personalMonth + curDate);
      days.push({
        dayOfWeek: dayNames[d.getDay()],
        dateFormatted: `${d.getDate()}/${d.getMonth() + 1}`,
        personalDay: pDay,
        isToday: offset === 0,
      });
    }

    return {
      fullName: rawFullName,
      firstName,
      lastName,
      dob: cleanDob,
      gender: genderInput || 'other',
      map,
      timeline: {
        currentYear,
        personalYear,
        currentMonth,
        personalMonth,
        days,
      },
      calculatedAt: new Date().toISOString(),
    };
  }
}
