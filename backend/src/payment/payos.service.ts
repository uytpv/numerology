import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

export interface CreatePayOSLinkDto {
  orderCode: number;
  amount: number;
  description: string;
  cancelUrl: string;
  returnUrl: string;
  items?: Array<{ name: string; quantity: number; price: number }>;
}

@Injectable()
export class PayOSService {
  private readonly logger = new Logger(PayOSService.name);
  private payOSClient: any = null;
  private clientId: string;
  private apiKey: string;
  private checksumKey: string;

  constructor(private configService: ConfigService) {
    this.clientId = this.configService.get<string>('PAYOS_CLIENT_ID') || '';
    this.apiKey = this.configService.get<string>('PAYOS_API_KEY') || '';
    this.checksumKey = this.configService.get<string>('PAYOS_CHECKSUM_KEY') || '';

    if (this.clientId && this.apiKey && this.checksumKey) {
      try {
        const PayOSClass = require('@payos/node');
        this.payOSClient = new (PayOSClass.default || PayOSClass)(this.clientId, this.apiKey, this.checksumKey);
        this.logger.log('Khởi tạo PayOS SDK thành công.');
      } catch (error: any) {
        this.logger.error('Lỗi khởi tạo PayOS SDK:', error.message);
      }
    } else {
      this.logger.warn('Chưa cấu hình đầy đủ biến môi trường PAYOS (PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY). Sẽ sử dụng chế độ Sandbox VietQR.');
    }
  }

  /**
   * Tạo Payment Link PayOS (Mã QR VietQR động)
   */
  async createPaymentLink(data: CreatePayOSLinkDto): Promise<any> {
    if (this.payOSClient) {
      try {
        const response = await this.payOSClient.createPaymentLink({
          orderCode: data.orderCode,
          amount: data.amount,
          description: data.description.substring(0, 25),
          cancelUrl: data.cancelUrl,
          returnUrl: data.returnUrl,
          items: data.items || [{ name: data.description, quantity: 1, price: data.amount }],
        });
        return response;
      } catch (error: any) {
        this.logger.error('Lỗi gọi API PayOS createPaymentLink:', error.message);
        throw error;
      }
    }

    // Chế độ Giả Lập Dev / VietQR Sandbox khi chưa điền API Key thật
    this.logger.log(`[PayOS VietQR Sandbox] Tạo mã VietQR cho Order #${data.orderCode} - Số tiền: ${data.amount} VND`);
    const mockAccountNumber = '102870192838';
    const mockBankName = 'MBBank';
    const mockAccountName = 'CONG TY NUMEROLOGY AI';
    const memo = `NUMERO${data.orderCode}`;
    const mockQrCode = `https://img.vietqr.io/image/${mockBankName}-${mockAccountNumber}-compact.png?amount=${data.amount}&addInfo=${memo}&accountName=${encodeURIComponent(mockAccountName)}`;

    return {
      bin: '970422',
      accountNumber: mockAccountNumber,
      accountName: mockAccountName,
      amount: data.amount,
      description: memo,
      orderCode: data.orderCode,
      currency: 'VND',
      paymentLinkId: `mock_${data.orderCode}`,
      status: 'PENDING',
      checkoutUrl: mockQrCode,
      qrCode: mockQrCode,
    };
  }

  /**
   * Xác thực chữ ký dữ liệu Webhook từ PayOS
   */
  verifyWebhookSignature(webhookBody: any): boolean {
    if (!this.checksumKey) {
      return true;
    }

    if (this.payOSClient) {
      try {
        const verifiedData = this.payOSClient.verifyPaymentWebhookData(webhookBody);
        return !!verifiedData;
      } catch (error: any) {
        this.logger.warn('Chữ ký PayOS không hợp lệ theo SDK:', error.message);
      }
    }

    try {
      const { data, signature } = webhookBody;
      if (!data || !signature) return false;

      const sortedKeys = Object.keys(data).sort();
      const signString = sortedKeys.map(k => `${k}=${data[k]}`).join('&');

      const hmac = crypto.createHmac('sha256', this.checksumKey);
      const computedSignature = hmac.update(signString).digest('hex');

      return computedSignature === signature;
    } catch (e: any) {
      this.logger.error('Lỗi xác thực signature PayOS:', e.message);
      return false;
    }
  }
}
