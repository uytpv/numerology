import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { PayOSService } from './payos.service';
import { CustomersService } from '../customers/customers.service';

export interface PricingPlan {
  id: string;
  name: string;
  nameVi: string;
  type: 'b2c_single' | 'b2c_family' | 'coach_credits' | 'coach_pro' | 'coach_vip';
  priceVnd: number;
  priceUsd: number;
  tier?: number;
  credits?: number;
  durationDays?: number;
  features: string[];
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'b2c_tier1',
    name: 'Khám Phá Thách Thức (Tier 1)',
    nameVi: 'Khám Phá Thách Thức & Nợ Nghiệp',
    type: 'b2c_single',
    priceVnd: 99000,
    priceUsd: 4.99,
    tier: 1,
    features: [
      'Phân tích chỉ số Thách thức & Điểm nghẽn',
      'Luận giải Nợ nghiệp & Bài học cuộc đời',
      'Xuất báo cáo cá nhân hóa'
    ]
  },
  {
    id: 'b2c_tier2',
    name: 'Bản Đồ Trọn Vẹn & AI Coach (Tier 2)',
    nameVi: 'Bản Đồ Giải Pháp Toàn Diện & Trợ Lý AI Coach',
    type: 'b2c_single',
    priceVnd: 199000,
    priceUsd: 9.99,
    tier: 2,
    features: [
      'Bao gồm toàn bộ quyền lợi Tier 1',
      'Kế hoạch hành động & Định hướng nghề nghiệp',
      'Dự báo Vận hạn Năm & Tháng cá nhân',
      'Trò chuyện trực tiếp không giới hạn với AI Coach',
      'Tải trọn bộ báo cáo PDF 35+ trang'
    ]
  },
  {
    id: 'b2c_family',
    name: 'Gói Tương Hợp Gia Đình (5 Hồ Sơ)',
    nameVi: 'Gói Tương Hợp Gia Đình (5 Bản Đồ)',
    type: 'b2c_family',
    priceVnd: 499000,
    priceUsd: 19.99,
    tier: 2,
    credits: 5,
    features: [
      'Mở khóa trọn bộ 5 hồ sơ Tier 2 cho người thân',
      'Phân tích tam giác tương hợp Vợ - Chồng',
      'Định hướng tiềm năng & cách giáo dục con cái',
      'Xuất PDF gia đình trọn vẹn'
    ]
  },
  {
    id: 'coach_pack_50',
    name: 'Gói Mua Sỉ 50 Lượt Mở Bản Đồ (Coach Starter)',
    nameVi: 'Gói Đại Lý / Coach: 50 Lượt Tra Cứu Toàn Diện',
    type: 'coach_credits',
    priceVnd: 1490000,
    priceUsd: 65.0,
    credits: 50,
    features: [
      '50 lượt mở bản đồ Tier 2 trọn đời (tiết kiệm 70%)',
      'Tự chủ động mở khóa cho khách hàng và thu tiền trực tiếp',
      'Không giới hạn thời hạn sử dụng lượt'
    ]
  },
  {
    id: 'coach_pro_monthly',
    name: 'Coach Pro SaaS (Thuê Bao Hàng Tháng)',
    nameVi: 'Gói Thuê Bao Công Cụ Coach Pro (Hàng Tháng)',
    type: 'coach_pro',
    priceVnd: 499000,
    priceUsd: 25.0,
    durationDays: 30,
    credits: 50,
    features: [
      '50 lượt tạo báo cáo chuyên sâu mỗi tháng',
      'White-label PDF: Gắn Logo, Tên thương hiệu, SĐT của Coach',
      'Mini CRM: Quản lý khách hàng, ghi chú tư vấn',
      'AI Copilot: Gợi ý kịch bản tư vấn nhanh trước buổi gặp'
    ]
  },
  {
    id: 'coach_vip_annual',
    name: 'Coach VIP Master (Thuê Bao Hàng Năm)',
    nameVi: 'Gói Đối Tác VIP Master Coach (1 Năm)',
    type: 'coach_vip',
    priceVnd: 4990000,
    priceUsd: 220.0,
    durationDays: 365,
    credits: 9999,
    features: [
      'Không giới hạn lượt tạo báo cáo trong 1 năm',
      'Trọn bộ White-label PDF + CRM + AI Copilot',
      'Ưu tiên nhận phân bổ Khách hàng tiềm năng (Lead) từ hệ thống',
      'Hồ sơ chính thức trên Danh bạ Chuyên gia uy tín'
    ]
  }
];

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private firebaseService: FirebaseService,
    private payOSService: PayOSService,
    private customersService: CustomersService,
  ) {}

  /**
   * Lấy danh sách các bảng giá hiện tại
   */
  getPricingPlans(): PricingPlan[] {
    return PRICING_PLANS;
  }

  /**
   * Tạo đơn hàng và lấy link thanh toán PayOS (VietQR)
   */
  async createPayOSOrder(params: {
    planId: string;
    customerId?: string;
    userId: string;
    userEmail?: string;
    cancelUrl: string;
    returnUrl: string;
  }): Promise<any> {
    const plan = PRICING_PLANS.find(p => p.id === params.planId);
    if (!plan) {
      throw new NotFoundException('Không tìm thấy gói dịch vụ yêu cầu');
    }

    // Sinh mã đơn hàng số nguyên 6 chữ số ngẫu nhiên kèm timestamp
    const orderCode = Number(`${Math.floor(100 + Math.random() * 900)}${Date.now().toString().slice(-6)}`);
    const db = this.firebaseService.db();

    // 1. Tạo bản ghi đơn hàng trong Firestore collection 'orders'
    const orderRecord = {
      orderCode,
      planId: plan.id,
      planName: plan.nameVi,
      planType: plan.type,
      amount: plan.priceVnd,
      currency: 'VND',
      targetTier: plan.tier || 0,
      creditsGranted: plan.credits || 0,
      durationDays: plan.durationDays || 0,
      customerId: params.customerId || null,
      userId: params.userId,
      userEmail: params.userEmail || null,
      status: 'PENDING',
      gateway: 'PAYOS',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.collection('orders').doc(orderCode.toString()).set(orderRecord);

    // 2. Gọi PayOS tạo Payment Link
    const payosRes = await this.payOSService.createPaymentLink({
      orderCode,
      amount: plan.priceVnd,
      description: `NUMERO ${orderCode}`,
      cancelUrl: params.cancelUrl,
      returnUrl: params.returnUrl,
      items: [
        {
          name: plan.nameVi.substring(0, 50),
          quantity: 1,
          price: plan.priceVnd,
        },
      ],
    });

    return {
      orderCode,
      plan,
      payos: payosRes,
    };
  }

  /**
   * Xử lý xác nhận đơn hàng thành công (Idempotent)
   */
  async processSuccessfulOrder(orderCode: number, transactionDetails?: any): Promise<boolean> {
    const db = this.firebaseService.db();
    const orderRef = db.collection('orders').doc(orderCode.toString());
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      this.logger.warn(`Không tìm thấy đơn hàng #${orderCode} trong Firestore!`);
      return false;
    }

    const orderData = orderDoc.data() as any;
    if (orderData.status === 'PAID') {
      this.logger.log(`Đơn hàng #${orderCode} đã được xử lý trước đó.`);
      return true;
    }

    this.logger.log(`--- XỬ LÝ KÍCH HOẠT ĐƠN HÀNG #${orderCode} [${orderData.planType}] ---`);

    // 1. Nếu là đơn mở khóa hồ sơ cá nhân (b2c_single / b2c_family)
    if (orderData.customerId && orderData.targetTier > 0) {
      try {
        await this.customersService.unlockTier(orderData.customerId, orderData.targetTier);
        this.logger.log(`Đã mở khóa Tier ${orderData.targetTier} cho customer ${orderData.customerId}`);
      } catch (err: any) {
        this.logger.error(`Lỗi mở khóa customer:`, err.message);
      }
    }

    // 2. Nếu đơn mua thêm Credits hoặc Đăng ký Gói Coach
    if (orderData.userId) {
      const userRef = db.collection('users').doc(orderData.userId);
      const userDoc = await userRef.get();
      const userData = userDoc.exists ? userDoc.data() : {};

      const currentCredits = userData?.credits || 0;
      const addedCredits = orderData.creditsGranted || 0;
      const newCredits = currentCredits + addedCredits;

      const updatePayload: any = {
        updatedAt: new Date().toISOString(),
      };

      if (addedCredits > 0) {
        updatePayload.credits = newCredits;
      }

      // Xử lý gói Coach Pro / VIP Subscription
      if (orderData.planType === 'coach_pro' || orderData.planType === 'coach_vip') {
        const now = new Date();
        const durationDays = orderData.durationDays || 30;
        const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString();

        updatePayload.role = 'coach';
        updatePayload.subscription = {
          planId: orderData.planId,
          planType: orderData.planType,
          status: 'ACTIVE',
          startDate: now.toISOString(),
          expiresAt: expiresAt,
        };
      }

      if (Object.keys(updatePayload).length > 1) {
        await userRef.set(updatePayload, { merge: true });
        this.logger.log(`Đã cập nhật User ${orderData.userId}: +${addedCredits} credits, Subscription cập nhật.`);
      }
    }

    // 3. Cập nhật trạng thái đơn hàng thành PAID
    await orderRef.update({
      status: 'PAID',
      transactionDetails: transactionDetails || {},
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return true;
  }

  /**
   * Tra cứu trạng thái đơn hàng cho frontend realtime polling
   */
  async getOrderStatus(orderCode: string): Promise<any> {
    const db = this.firebaseService.db();
    const doc = await db.collection('orders').doc(orderCode).get();
    if (!doc.exists) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }
    return doc.data();
  }
}
