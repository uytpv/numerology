import { Injectable, Logger, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentService } from './payment.service';
import { FirebaseService } from '../firebase/firebase.service';

export interface SePayWebhookPayload {
  id: number | string;
  gateway: string;
  transactionDate: string;
  accountNumber: string;
  subAccount?: string | null;
  code?: string | null;
  content: string;
  transferType: 'in' | 'out';
  description?: string;
  transferAmount: number;
  referenceCode?: string;
  accumulated?: number;
}

@Injectable()
export class SePayService {
  private readonly logger = new Logger(SePayService.name);
  private readonly secretKey: string;
  private readonly merchantId: string;

  constructor(
    private configService: ConfigService,
    private paymentService: PaymentService,
    private firebaseService: FirebaseService,
  ) {
    this.secretKey = this.configService.get<string>('SEPAY_SECRET_KEY') || 'spsk_test_Dt6m122tKAfKY2JMry3WDmA7KKBwQEiL';
    this.merchantId = this.configService.get<string>('SEPAY_MERCHANT_ID') || 'SP-TEST-TP4A82AA';
    this.logger.log(`Khởi tạo SePayService - Merchant: ${this.merchantId}`);
  }

  /**
   * Xác thực chữ ký/token của SePay gửi kèm trong Header
   */
  verifyWebhookAuth(authHeader?: string, payload?: SePayWebhookPayload): boolean {
    if (!this.secretKey) {
      this.logger.warn('Chưa cấu hình SEPAY_SECRET_KEY, tạm thời bỏ qua xác thực auth header.');
      return true;
    }

    if (authHeader) {
      // SePay gửi header dạng "Apikey <SECRET_KEY>" hoặc "Bearer <SECRET_KEY>" hoặc chuỗi secretKey
      const cleanHeader = authHeader.replace(/^(Apikey|Bearer)\s+/i, '').trim();
      if (cleanHeader === this.secretKey.trim()) {
        return true;
      }
      this.logger.warn(`Header SePay nhận được: "${authHeader}" không khớp với SEPAY_SECRET_KEY.`);
    } else {
      this.logger.warn('SePay Webhook gửi tới không kèm Authorization header.');
    }

    // Cơ chế an toàn dự phòng: Kiểm tra tài khoản đích chính xác là 12688937 (ACB)
    const targetAccount = payload?.accountNumber || (payload as any)?.subAccount;
    if (targetAccount && targetAccount.toString().includes('12688937')) {
      this.logger.log(`Chấp thuận Webhook an toàn dự phòng theo tài khoản đích hợp lệ: ${targetAccount}`);
      return true;
    }

    return false;
  }

  /**
   * Trích xuất mã đơn hàng dạng TSH + 6 số (ví dụ: TSH123456) từ nội dung chuyển khoản
   */
  extractOrderCode(content: string): string | null {
    if (!content) return null;
    const match = content.toUpperCase().match(/TSH\d{6}/);
    return match ? match[0] : null;
  }

  /**
   * Xử lý webhook từ SePay khi có biến động số dư tiền vào (transferType = 'in')
   */
  async processWebhook(payload: SePayWebhookPayload, authHeader?: string): Promise<{ success: boolean; message: string; orderCode?: string }> {
    this.logger.log(`Nhận SePay Webhook: Giao dịch #${payload.id} - ${payload.transferAmount} VND - Nội dung: "${payload.content}"`);

    // 1. Xác thực bảo mật qua SePay Secret Key hoặc tài khoản ngân hàng đích
    const isValid = this.verifyWebhookAuth(authHeader, payload);
    if (!isValid) {
      this.logger.warn(`Từ chối SePay Webhook do không hợp lệ! Header: "${authHeader}", TK: "${payload.accountNumber}"`);
      throw new UnauthorizedException('Chữ ký xác thực SePay không hợp lệ hoặc thiếu Authorization header');
    }

    // 2. Chỉ xử lý giao dịch tiền vào (transferType: 'in')
    if (payload.transferType && payload.transferType.toLowerCase() !== 'in') {
      this.logger.log(`Bỏ qua giao dịch tiền ra (transferType: ${payload.transferType})`);
      return { success: true, message: 'Bỏ qua giao dịch không phải tiền vào' };
    }

    // 3. Trích xuất mã đơn hàng TSHxxxxxx
    const rawContent = `${payload.content || ''} ${payload.description || ''}`;
    const orderCode = this.extractOrderCode(rawContent);

    if (!orderCode) {
      this.logger.warn(`Không tìm thấy mã đơn hàng TSHxxxxxx trong nội dung chuyển khoản: "${rawContent}"`);
      await this.logPaymentAudit({
        status: 'INVALID_CODE',
        transferAmount: Number(payload.transferAmount) || 0,
        orderCode: null,
        message: `Không tìm thấy mã TSH trong nội dung: "${rawContent}"`,
        payload,
      });
      return { success: false, message: 'Không tìm thấy mã đơn hàng TSHxxxxxx trong nội dung' };
    }

    // 4. Tìm đơn hàng trong Firestore
    const db = this.firebaseService.db();
    const orderRef = db.collection('orders').doc(orderCode);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      this.logger.warn(`Đơn hàng #${orderCode} không tồn tại trong Firestore!`);
      await this.logPaymentAudit({
        status: 'ORDER_NOT_FOUND',
        transferAmount: Number(payload.transferAmount) || 0,
        orderCode,
        message: `Đơn hàng #${orderCode} không tồn tại trong hệ thống`,
        payload,
      });
      return { success: false, message: `Đơn hàng #${orderCode} không tồn tại`, orderCode };
    }

    const orderData = orderDoc.data() as any;

    // 5. Kiểm tra tính Idempotent (Nếu đã kích hoạt thì trả về thành công, không cộng lặp)
    if (orderData.status === 'PAID') {
      this.logger.log(`Đơn hàng #${orderCode} đã được kích hoạt trước đó.`);
      return { success: true, message: `Đơn hàng #${orderCode} đã được kích hoạt trước đó`, orderCode };
    }

    // 6. Kiểm tra số tiền chuyển có đủ không
    const expectedAmount = Number(orderData.amount) || 0;
    const receivedAmount = Number(payload.transferAmount) || 0;

    if (receivedAmount < expectedAmount) {
      this.logger.warn(`Số tiền nhận được (${receivedAmount}) nhỏ hơn số tiền đơn hàng (${expectedAmount}) cho đơn #${orderCode}!`);
      // Lưu lại giao dịch thiếu tiền để admin tra soát
      await orderRef.update({
        partialPayment: {
          receivedAmount,
          expectedAmount,
          transactionId: payload.id,
          date: payload.transactionDate,
        },
        updatedAt: new Date().toISOString(),
      });
      await this.logPaymentAudit({
        status: 'PARTIAL_PAYMENT',
        transferAmount: receivedAmount,
        orderCode,
        message: `Chuyển thiếu tiền: Nhận ${receivedAmount} / Cần ${expectedAmount}`,
        payload,
      });
      return { success: false, message: 'Số tiền chuyển khoản không đủ', orderCode };
    }

    // 7. Kích hoạt đơn hàng qua PaymentService
    const activated = await this.paymentService.processSuccessfulOrder(orderCode, {
      gateway: payload.gateway || 'ACB',
      transactionId: payload.id,
      transactionDate: payload.transactionDate,
      receivedAmount,
      accountNumber: payload.accountNumber,
      referenceCode: payload.referenceCode || null,
      source: 'SEPAY_WEBHOOK',
    });

    this.logger.log(`[SePay Webhook] Kích hoạt thành công đơn hàng #${orderCode} cho khách hàng ${orderData.userName || orderData.userEmail}`);

    await this.logPaymentAudit({
      status: 'SUCCESS',
      transferAmount: receivedAmount,
      orderCode,
      message: `Kích hoạt thành công đơn hàng #${orderCode}`,
      payload,
    });

    return {
      success: activated,
      message: `Đã kích hoạt thành công đơn hàng #${orderCode}`,
      orderCode,
    };
  }

  /**
   * Lưu nhật ký kiểm toán giao dịch SePay vào Firestore
   */
  private async logPaymentAudit(data: {
    status: 'SUCCESS' | 'PARTIAL_PAYMENT' | 'ORDER_NOT_FOUND' | 'INVALID_CODE' | 'IGNORED';
    transferAmount: number;
    orderCode?: string | null;
    message: string;
    payload: any;
  }) {
    try {
      const db = this.firebaseService.db();
      await db.collection('payment_logs').add({
        ...data,
        createdAt: new Date().toISOString(),
      });
    } catch (err: any) {
      this.logger.error(`Lỗi ghi payment_logs:`, err.message);
    }
  }
}
