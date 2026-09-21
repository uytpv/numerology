import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { FieldValue } from 'firebase-admin/firestore';
import { FirebaseService } from '../firebase/firebase.service';
import { VietQRService, VietQRResponse } from './vietqr.service';
import { EmailService } from './email.service';
import { CustomersService } from '../customers/customers.service';

export interface PricingPlan {
  id: string;
  name: string;
  nameVi: string;
  type: 'b2c_single' | 'b2c_family' | 'coach_batch' | 'coach_sub';
  priceVnd: number;
  priceUsd: number;
  tier?: number;
  credits?: number;
  durationDays?: number;
  badge?: string;
  features: string[];
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'test_plan_2k',
    name: 'Gói Thử Nghiệm QR (2.000đ)',
    nameVi: 'Gói Thử Nghiệm QR Localhost (2.000 VND)',
    type: 'b2c_single',
    priceVnd: 2000,
    priceUsd: 0.1,
    tier: 3,
    credits: 1,
    badge: 'Test QR Thật 2K',
    features: [
      'Quét mã QR app ngân hàng thật (ACB)',
      'Số tiền chuyển khoản siêu nhỏ: 2.000 VNĐ',
      'Kích hoạt mở khóa trọn bộ báo cáo Tầng 3',
      'Kiểm thử Webhook SePay tức thì'
    ]
  },
  {
    id: 'b2c_single_discovery',
    name: 'Gói Cá Nhân Khám Phá',
    nameVi: 'Gói Cá Nhân Khám Phá',
    type: 'b2c_single',
    priceVnd: 39000,
    priceUsd: 1.99,
    tier: 3,
    credits: 1,
    badge: 'Mở Khóa Nhanh',
    features: [
      'Mở khóa trọn vẹn 3 Tầng Luận Giải Độc Bản',
      'Đầy đủ 21 chỉ số Pythagoras & Sơ đồ Kim Tự Tháp',
      'Xuất bản Ebook PDF 30+ trang chuẩn in ấn cao cấp'
    ]
  },
  {
    id: 'b2c_single_200k',
    name: 'Gói Cá Nhân Chuyên Sâu',
    nameVi: 'Gói Cá Nhân Chuyên Sâu (Tier 3)',
    type: 'b2c_single',
    priceVnd: 200000,
    priceUsd: 9.99,
    tier: 3,
    credits: 1,
    badge: 'B2C Bán Chạy',
    features: [
      'Mở khóa trọn vẹn Tầng 3 Luận Giải Đa Chiều Chuyên Sâu',
      'Đầy đủ 17 chỉ số Pythagoras chuyên sâu',
      'Phân tích Ma trận Nợ nghiệp & Điểm nghẽn cuộc đời',
      'Lộ trình hành động chuyển hóa & Định hướng sự nghiệp',
      'Dự báo vận hạn 12 tháng & 4 đỉnh cao kim tự tháp',
      'Hỗ trợ kỹ thuật & Kênh CSKH trực tuyến 24/7',
      'Xuất bản Ebook PDF 30+ trang chuẩn in ấn'
    ]
  },
  {
    id: 'b2c_tier2',
    name: 'Bản Đồ Toàn Diện & Kế Hoạch Chuyển Hóa',
    nameVi: 'Bản Đồ Giải Pháp Toàn Diện (Tier 2/3)',
    type: 'b2c_single',
    priceVnd: 199000,
    priceUsd: 9.99,
    tier: 2,
    credits: 1,
    features: [
      'Phân tích chỉ số Thách thức & Điểm nghẽn',
      'Luận giải Nợ nghiệp & Bài học cuộc đời',
      'Kế hoạch hành động & Định hướng nghề nghiệp',
      'Dự báo Vận hạn Năm & Tháng cá nhân',
      'Tải trọn bộ báo cáo PDF 35+ trang'
    ]
  },
  {
    id: 'b2c_family_10_890k',
    name: 'Gói Gia Đình Gắn Kết (10 Bản Đồ)',
    nameVi: 'Gói Gia Đình Gắn Kết (10 Lượt Báo Cáo)',
    type: 'b2c_family',
    priceVnd: 890000,
    priceUsd: 39.99,
    tier: 3,
    credits: 10,
    badge: 'Tiết Kiệm 55%',
    features: [
      '10 lượt luận giải chuyên sâu trọn vẹn 3 tầng',
      'Phân tích tiềm năng & thiên hướng giáo dục cho trẻ nhỏ',
      'Thấu hiểu bản sắc và định hướng phát triển từng thành viên',
      'Không giới hạn thời gian sử dụng 10 lượt',
      'Xuất 10 file PDF chuyên biệt cho từng thành viên',
      'Ưu tiên tốc độ xử lý & Xuất bản báo cáo tức thì'
    ]
  },
  {
    id: 'b2c_family',
    name: 'Gói Gia Đình Thấu Hiểu (5 Hồ Sơ)',
    nameVi: 'Gói Gia Đình Thấu Hiểu (5 Bản Đồ)',
    type: 'b2c_family',
    priceVnd: 499000,
    priceUsd: 19.99,
    tier: 3,
    credits: 5,
    features: [
      'Mở khóa trọn bộ 5 hồ sơ Tier 3 cho người thân',
      'Định hướng tiềm năng & cách giáo dục con cái',
      'Thấu hiểu tâm lý và điểm mạnh của từng thành viên',
      'Xuất PDF gia đình trọn vẹn'
    ]
  },
  {
    id: 'coach_starter_100_4900k',
    name: 'Coach Khởi Nghiệp (100 bài)',
    nameVi: 'Gói Coach Khởi Nghiệp: 100 Lượt Báo Cáo Chuyên Sâu',
    type: 'coach_batch',
    priceVnd: 4900000,
    priceUsd: 215.0,
    credits: 100,
    features: [
      '100 lượt xuất báo cáo chuyên sâu Tầng 3 (49k/bài)',
      'Tùy biến Logo & Thương hiệu chuyên gia trên báo cáo PDF',
      'Cổng quản lý danh sách khách hàng CRM thông minh',
      'Ghi chú hồ sơ tư vấn khách hàng bảo mật',
      'Tham gia Mạng Lưới Chuyên Gia Toàn Quốc'
    ]
  },
  {
    id: 'coach_scale_200_7900k',
    name: 'Coach Tăng Tốc (200 bài)',
    nameVi: 'Gói Coach Tăng Tốc: 200 Lượt Báo Cáo Chuyên Sâu',
    type: 'coach_batch',
    priceVnd: 7900000,
    priceUsd: 345.0,
    credits: 200,
    badge: 'Chuyên Gia Lựa Chọn',
    features: [
      '200 lượt xuất báo cáo chuyên sâu (Giá vốn siêu tối ưu 39k)',
      'Đầy đủ tính năng White-label thương hiệu riêng',
      'Hỗ trợ tích hợp Form khảo sát tự động cho khách hàng',
      'Bộ tài liệu biểu mẫu kịch bản tư vấn chuẩn quốc tế',
      'Cấp quyền truy cập Mạng Lưới Chuyên Gia VIP'
    ]
  },
  {
    id: 'coach_pro_500_14900k',
    name: 'Coach Quy Mô Lớn (500 bài)',
    nameVi: 'Gói Coach Quy Mô Lớn: 500 Lượt Báo Cáo',
    type: 'coach_batch',
    priceVnd: 14900000,
    priceUsd: 650.0,
    credits: 500,
    features: [
      '500 lượt xuất báo cáo chuyên sâu (Giá vốn chỉ 29k/bài)',
      'Hệ thống quản lý phân quyền cộng tác viên',
      'Hỗ trợ kỹ thuật VIP 24/7 & Thiết kế template PDF riêng',
      'Chia sẻ cơ hội kết nối khách hàng từ nền tảng'
    ]
  },
  {
    id: 'coach_annual_vip_4990k',
    name: 'Coach VIP Hội Viên Năm',
    nameVi: 'Gói Đối Tác VIP Master Coach (1 Năm)',
    type: 'coach_sub',
    priceVnd: 4990000,
    priceUsd: 220.0,
    durationDays: 365,
    credits: 50,
    badge: 'Doanh Nhân & Viện Đào Tạo',
    features: [
      'Không giới hạn tính năng nền tảng trong 365 ngày',
      'Tặng kèm 50 lượt báo cáo chuyên sâu VIP',
      'Hưởng mức giá nạp sỉ báo cáo ưu đãi nhất hệ thống (25k/bài)',
      'Huy hiệu Chuyên Gia Xác Thực (Verified Life Coach)',
      'Hiển thị nổi bật trên Danh bạ Mạng Lưới Chuyên Gia toàn quốc',
      'Cố vấn chiến lược phát triển thương hiệu cá nhân 1-1'
    ]
  },
  {
    id: 'coach_pack_50',
    name: 'Gói Coach Starter 50 bài',
    nameVi: 'Gói Đại Lý / Coach: 50 Lượt Báo Cáo',
    type: 'coach_batch',
    priceVnd: 1490000,
    priceUsd: 65.0,
    credits: 50,
    features: [
      '50 lượt mở bản đồ Tier 3 trọn đời',
      'Tự chủ động mở khóa cho khách hàng và thu tiền trực tiếp',
      'Không giới hạn thời hạn sử dụng lượt'
    ]
  }
];

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private firebaseService: FirebaseService,
    private vietQRService: VietQRService,
    private emailService: EmailService,
    private customersService: CustomersService,
  ) {}

  /**
   * Lấy danh sách các bảng giá hiện tại
   */
  getPricingPlans(): PricingPlan[] {
    return PRICING_PLANS;
  }

  /**
   * Tạo đơn hàng thanh toán qua VietQR (Ngân hàng ACB - TRA PHUC VINH UY)
   */
  async createVietQROrder(params: {
    planId: string;
    customerId?: string;
    userId: string;
    userEmail?: string;
    userName?: string;
  }): Promise<any> {
    const plan = PRICING_PLANS.find(p => p.id === params.planId);
    if (!plan) {
      throw new NotFoundException(`Không tìm thấy gói dịch vụ: ${params.planId}`);
    }

    // Sinh mã đơn hàng dạng TSH + 6 số ngẫu nhiên
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderCode = `TSH${randomSuffix}`;
    const memo = `TSH${randomSuffix}`;

    const db = this.firebaseService.db();

    // 1. Tạo bản ghi đơn hàng trong Firestore collection 'orders'
    const orderRecord = {
      orderCode,
      planId: plan.id,
      planName: plan.nameVi,
      planType: plan.type,
      amount: plan.priceVnd,
      currency: 'VND',
      targetTier: plan.tier || 3,
      creditsGranted: plan.credits || 0,
      durationDays: plan.durationDays || 0,
      features: plan.features,
      customerId: params.customerId || null,
      userId: params.userId,
      userEmail: params.userEmail || null,
      userName: params.userName || 'Khách hàng',
      status: 'PENDING',
      paymentMethod: 'VIETQR_ACB',
      bankInfo: {
        bankName: 'Ngân hàng TMCP Á Châu (ACB)',
        bin: '970416',
        accountNumber: '12688937',
        accountName: 'TRA PHUC VINH UY',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.collection('orders').doc(orderCode).set(orderRecord);

    // 2. Gọi VietQR Service sinh mã QR
    const qrResult: VietQRResponse = await this.vietQRService.generateQRCode({
      amount: plan.priceVnd,
      orderCode,
      description: memo,
      accountNo: '12688937',
      accountName: 'TRA PHUC VINH UY',
      bin: '970416',
      template: 'hjTz6tf',
    });

    this.logger.log(`Tạo thành công đơn hàng VietQR #${orderCode} cho gói [${plan.nameVi}] - ${plan.priceVnd.toLocaleString('vi-VN')} VND`);

    return {
      orderCode,
      plan,
      vietqr: qrResult,
      // Tương thích ngược với PayOS response format cho các component cũ nếu cần
      payos: {
        orderCode,
        amount: plan.priceVnd,
        description: memo,
        accountNumber: qrResult.accountNumber,
        accountName: qrResult.accountName,
        qrCode: qrResult.qrDataURL || qrResult.quickLinkUrl,
        checkoutUrl: qrResult.quickLinkUrl,
      }
    };
  }

  /**
   * Xử lý xác nhận đơn hàng thành công (Idempotent & Atomic Transaction)
   */
  async processSuccessfulOrder(orderCodeInput: string | number, transactionDetails?: any): Promise<boolean> {
    const orderCode = orderCodeInput.toString();
    const db = this.firebaseService.db();
    const orderRef = db.collection('orders').doc(orderCode);

    let orderData: any = null;
    let shouldSendEmail = false;

    try {
      const activated = await db.runTransaction(async (transaction) => {
        const orderDoc = await transaction.get(orderRef);
        if (!orderDoc.exists) {
          this.logger.warn(`Không tìm thấy đơn hàng #${orderCode} trong Firestore!`);
          return false;
        }

        orderData = orderDoc.data();
        if (orderData.status === 'PAID') {
          this.logger.log(`[Idempotent] Đơn hàng #${orderCode} đã được kích hoạt trước đó.`);
          return true;
        }

        // 1. Cập nhật trạng thái đơn hàng thành PAID bên trong transaction
        const paidAt = new Date().toISOString();
        transaction.update(orderRef, {
          status: 'PAID',
          transactionDetails: transactionDetails || {},
          completedAt: paidAt,
          updatedAt: paidAt,
        });

        // 2. Cập nhật quyền lợi cho User tài khoản (Atomic Credits Increment & Subscription)
        if (orderData.userId && orderData.userId !== 'guest_user') {
          const userRef = db.collection('users').doc(orderData.userId);
          const userDoc = await transaction.get(userRef);
          const addedCredits = Number(orderData.creditsGranted) || 0;

          const updatePayload: any = {
            updatedAt: paidAt,
          };

          if (addedCredits > 0) {
            updatePayload.credits = FieldValue.increment(addedCredits);
          }

          // Xử lý gói Coach VIP Subscription
          if (orderData.planType === 'coach_sub' || (orderData.durationDays && orderData.durationDays > 0)) {
            const now = new Date();
            const durationDays = orderData.durationDays || 365;
            const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString();

            updatePayload.role = 'coach';
            updatePayload.isCoach = true;
            updatePayload.subscription = {
              planId: orderData.planId,
              planName: orderData.planName,
              planType: orderData.planType,
              status: 'ACTIVE',
              startDate: now.toISOString(),
              expiresAt: expiresAt,
            };
          }

          if (userDoc.exists) {
            transaction.update(userRef, updatePayload);
          } else {
            transaction.set(userRef, {
              ...updatePayload,
              credits: addedCredits,
              createdAt: paidAt,
            }, { merge: true });
          }
        }

        shouldSendEmail = true;
        return true;
      });

      if (!activated) return false;

      // 3. Mở khóa hồ sơ cá nhân (customerId) nếu có
      if (orderData?.customerId && orderData.targetTier > 0) {
        try {
          await this.customersService.unlockTier(orderData.customerId, orderData.targetTier);
          this.logger.log(`Đã mở khóa Tier ${orderData.targetTier} cho customer ${orderData.customerId}`);
        } catch (err: any) {
          this.logger.error(`Lỗi mở khóa customer:`, err.message);
        }
      }

      // 4. Gửi email xác nhận thanh toán tự động
      if (shouldSendEmail && orderData?.userEmail) {
        try {
          await this.emailService.sendPaymentSuccessEmail({
            toEmail: orderData.userEmail,
            userName: orderData.userName || orderData.userEmail,
            orderCode: orderData.orderCode || orderCode,
            planName: orderData.planName,
            amount: orderData.amount,
            creditsGranted: orderData.creditsGranted,
            durationDays: orderData.durationDays,
            features: orderData.features,
            paidAt: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
          });
        } catch (emailErr: any) {
          this.logger.error(`Lỗi gửi email xác nhận đơn hàng #${orderCode}:`, emailErr.message);
        }
      }

      return true;
    } catch (txError: any) {
      this.logger.error(`Lỗi Transaction khi kích hoạt đơn #${orderCode}:`, txError.message);
      return false;
    }
  }

  /**
   * Tra cứu trạng thái đơn hàng cho frontend realtime polling
   */
  async getOrderStatus(orderCodeInput: string | number): Promise<any> {
    const orderCode = orderCodeInput.toString();
    const db = this.firebaseService.db();
    const doc = await db.collection('orders').doc(orderCode).get();
    if (!doc.exists) {
      throw new NotFoundException(`Đơn hàng #${orderCode} không tồn tại`);
    }
    return doc.data();
  }

  /**
   * Lấy lịch sử tất cả các giao dịch của một người dùng
   */
  async getUserTransactions(userId: string): Promise<any[]> {
    if (!userId) {
      return [];
    }
    const db = this.firebaseService.db();
    const snapshot = await db
      .collection('orders')
      .where('userId', '==', userId)
      .get();

    const orders = snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    // Sắp xếp giảm dần theo thời gian tạo
    orders.sort((a: any, b: any) => {
      const tA = new Date(a.createdAt || 0).getTime();
      const tB = new Date(b.createdAt || 0).getTime();
      return tB - tA;
    });

    return orders;
  }
}
