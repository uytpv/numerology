import { Injectable, Logger, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { AIService } from '../ai/ai.service';
import { CustomersService } from '../customers/customers.service';
import { CoachBrandingDto, LeadRequestDto } from './dto';

@Injectable()
export class CoachesService {
  private readonly logger = new Logger(CoachesService.name);

  constructor(
    private firebaseService: FirebaseService,
    private aiService: AIService,
    private customersService: CustomersService,
  ) {}

  /**
   * Lấy thông tin tài khoản Coach và cấu hình White-label
   */
  async getCoachProfile(userId: string): Promise<any> {
    const db = this.firebaseService.db();
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return {
        userId,
        role: 'user',
        credits: 0,
        subscription: null,
        branding: {
          brandName: 'Life Coach Academy',
          title: 'Chuyên Gia Khai Vấn & Thần Số Học',
          phone: '',
          zalo: '',
          city: 'Toàn Quốc',
          customGreeting: 'Chào bạn, chúc bạn một hành trình thấu hiểu bản thân và chuyển hóa rực rỡ!',
        },
      };
    }

    const data = userDoc.data() as any;
    return {
      userId,
      role: data.role || 'user',
      credits: data.credits || 0,
      subscription: data.subscription || null,
      branding: data.branding || {
        brandName: 'Life Coach Academy',
        title: 'Chuyên Gia Khai Vấn & Thần Số Học',
        phone: '',
        zalo: '',
        city: 'Toàn Quốc',
        customGreeting: 'Chào bạn, chúc bạn một hành trình thấu hiểu bản thân và chuyển hóa rực rỡ!',
      },
    };
  }

  /**
   * Cập nhật cấu hình thương hiệu White-label cho Coach
   */
  async updateBranding(userId: string, dto: CoachBrandingDto): Promise<any> {
    const db = this.firebaseService.db();
    const userRef = db.collection('users').doc(userId);

    await userRef.set(
      {
        branding: dto,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return { success: true, message: 'Đã lưu cấu hình thương hiệu White-label thành công.' };
  }

  /**
   * Mini CRM: Lấy danh sách toàn bộ khách hàng mà Coach đã tra cứu / quản lý
   */
  async getClients(userId: string): Promise<any[]> {
    const db = this.firebaseService.db();
    const snapshot = await db.collection('customers')
      .where('userId', '==', userId)
      .get();

    const clients: any[] = [];
    snapshot.forEach((doc: any) => {
      const data = doc.data();
      clients.push({
        id: doc.id,
        ...data,
      });
    });

    return clients.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  /**
   * Lưu ghi chú tư vấn cá nhân cho khách hàng
   */
  async updateClientNotes(userId: string, customerId: string, notes: string): Promise<any> {
    const db = this.firebaseService.db();
    const customerRef = db.collection('customers').doc(customerId);
    const doc = await customerRef.get();

    if (!doc.exists) {
      throw new NotFoundException('Không tìm thấy hồ sơ khách hàng');
    }

    const data = doc.data() as any;
    if (data.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa hồ sơ này');
    }

    await customerRef.update({
      coachNotes: notes,
      lastConsultedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return { success: true, message: 'Đã lưu ghi chú tư vấn thành công.' };
  }

  /**
   * Mở khóa Tier 2 cho khách hàng bằng 1 Credit trong ví của Coach
   */
  async unlockClientWithCredits(userId: string, customerId: string): Promise<any> {
    const db = this.firebaseService.db();
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new NotFoundException('Không tìm thấy thông tin tài khoản');
    }

    const userData = userDoc.data() as any;
    const isVipSubscription = userData?.subscription?.status === 'ACTIVE' && userData?.subscription?.planType === 'coach_vip';
    const credits = userData?.credits || 0;

    if (!isVipSubscription && credits < 1) {
      throw new BadRequestException('Bạn không đủ lượt (Credits). Vui lòng mua thêm gói lượt để mở khóa cho khách.');
    }

    await this.customersService.unlockTier(customerId, 2);

    if (!isVipSubscription) {
      await userRef.update({
        credits: credits - 1,
        updatedAt: new Date().toISOString(),
      });
    }

    return {
      success: true,
      message: 'Đã dùng 1 Credit để mở khóa trọn vẹn bản đồ cho khách hàng!',
      remainingCredits: isVipSubscription ? 'Vô hạn' : credits - 1,
    };
  }

  /**
   * AI Copilot: Sinh kịch bản và phân tích nhanh giúp Coach trước buổi tư vấn
   */
  async generateCopilotAdvice(userId: string, customerId: string): Promise<any> {
    const customer = await this.customersService.findOne(customerId, userId, true);
    const map = customer.map;
    const fullName = `${customer.last_name} ${customer.first_name}`;

    return this.aiService.generatePersonalizedReport({
      fullName,
      dob: customer.dob,
      map: customer.map,
      tier: 2,
      language: 'vi'
    });
  }

  /**
   * Thuật toán Phân Bổ Khách Hàng Thông Minh (Smart Lead Distribution)
   */
  async requestLead(dto: LeadRequestDto): Promise<any> {
    const db = this.firebaseService.db();
    this.logger.log(`Nhận yêu cầu tư vấn 1-1 từ khách hàng: ${dto.fullName} - Tỉnh thành: ${dto.city}`);

    const coachesSnapshot = await db.collection('users')
      .where('role', '==', 'coach')
      .get();

    let matchedCoachId: string | null = null;
    let matchedCoachName: string = 'Chuyên Gia Tư Vấn Hệ Thống';

    if (!coachesSnapshot.empty) {
      const coaches: any[] = [];
      coachesSnapshot.forEach((doc: any) => {
        coaches.push({ id: doc.id, ...doc.data() });
      });

      const sameCityCoaches = coaches.filter(c => 
        c.branding?.city && c.branding.city.toLowerCase().includes(dto.city.toLowerCase())
      );

      const targetPool = sameCityCoaches.length > 0 ? sameCityCoaches : coaches;
      const selectedCoach = targetPool[Math.floor(Math.random() * targetPool.length)];
      matchedCoachId = selectedCoach.id;
      matchedCoachName = selectedCoach.branding?.brandName || selectedCoach.name || 'Life Coach';
    }

    const leadRecord = {
      ...dto,
      assignedCoachId: matchedCoachId,
      assignedCoachName: matchedCoachName,
      status: 'NEW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const leadRef = await db.collection('leads').add(leadRecord);

    return {
      success: true,
      leadId: leadRef.id,
      assignedCoachName: matchedCoachName,
      message: `Đã tiếp nhận yêu cầu! Chuyên gia tư vấn ${matchedCoachName} sẽ liên hệ với bạn qua SĐT ${dto.phone} trong vòng 24h.`,
    };
  }

  /**
   * Lấy danh sách Lead được phân bổ cho Coach
   */
  async getAssignedLeads(coachId: string): Promise<any[]> {
    const db = this.firebaseService.db();
    const snapshot = await db.collection('leads')
      .where('assignedCoachId', '==', coachId)
      .get();

    const leads: any[] = [];
    snapshot.forEach((doc: any) => {
      leads.push({ id: doc.id, ...doc.data() });
    });

    return leads.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  /**
   * Cập nhật trạng thái xử lý Lead
   */
  async updateLeadStatus(coachId: string, leadId: string, status: string, notes?: string): Promise<any> {
    const db = this.firebaseService.db();
    const leadRef = db.collection('leads').doc(leadId);
    const doc = await leadRef.get();

    if (!doc.exists) {
      throw new NotFoundException('Không tìm thấy Lead');
    }

    const data = doc.data() as any;
    if (data.assignedCoachId !== coachId) {
      throw new ForbiddenException('Bạn không có quyền quản lý Lead này');
    }

    await leadRef.update({
      status,
      coachNotes: notes || data.coachNotes || '',
      updatedAt: new Date().toISOString(),
    });

    return { success: true, message: 'Đã cập nhật trạng thái Lead.' };
  }
}
