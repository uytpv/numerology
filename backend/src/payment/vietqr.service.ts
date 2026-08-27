import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as https from 'https';

export interface GenerateVietQRParams {
  amount: number;
  orderCode: string | number;
  description: string;
  accountName?: string;
  accountNo?: string;
  bin?: string;
  template?: string;
}

export interface VietQRResponse {
  bin: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  description: string;
  orderCode: string | number;
  qrCode: string;
  qrDataURL: string;
  quickLinkUrl: string;
}

@Injectable()
export class VietQRService {
  private readonly logger = new Logger(VietQRService.name);

  private readonly clientId: string;
  private readonly apiKey: string;
  private readonly bankBin: string;
  private readonly bankName: string;
  private readonly accountNo: string;
  private readonly accountName: string;
  private readonly template: string;

  constructor(private configService: ConfigService) {
    this.clientId = this.configService.get<string>('VIETQR_CLIENT_ID') || '8070264f-f9e3-4de1-b8e5-a5d5d22d26e4';
    this.apiKey = this.configService.get<string>('VIETQR_API_KEY') || '2341501f-2939-4463-b727-eb70026cb87d';
    this.bankBin = this.configService.get<string>('VIETQR_BIN') || '970416';
    this.bankName = this.configService.get<string>('VIETQR_BANK_NAME') || 'Ngân hàng TMCP Á Châu (ACB)';
    this.accountNo = this.configService.get<string>('VIETQR_ACCOUNT_NO') || '12688937';
    this.accountName = this.configService.get<string>('VIETQR_ACCOUNT_NAME') || 'TRA PHUC VINH UY';
    this.template = this.configService.get<string>('VIETQR_TEMPLATE') || 'hjTz6tf';

    this.logger.log(`Khởi tạo VietQRService cho STK: ${this.accountNo} - ${this.accountName} (ACB / BIN ${this.bankBin})`);
  }

  /**
   * Tạo mã QR chuyển khoản VietQR chuẩn Napas qua API VietQR.io & Quick Link
   */
  async generateQRCode(params: GenerateVietQRParams): Promise<VietQRResponse> {
    const bin = params.bin || this.bankBin;
    const accountNo = params.accountNo || this.accountNo;
    const accountName = params.accountName || this.accountName;
    const template = params.template || this.template;
    const amount = Number(params.amount) || 0;
    const memo = params.description || `TSH${params.orderCode}`;

    // Tạo Quick link URL dự phòng
    const quickLinkUrl = `https://api.vietqr.io/image/${bin}-${accountNo}-${template}.jpg?amount=${amount}&addInfo=${encodeURIComponent(memo)}&accountName=${encodeURIComponent(accountName)}`;

    try {
      const apiResult = await this.callVietQRGenerateAPI({
        accountNo,
        accountName,
        acqId: bin,
        amount,
        addInfo: memo,
        format: 'text',
        template,
      });

      if (apiResult?.code === '00' && apiResult?.data) {
        return {
          bin,
          bankName: this.bankName,
          accountNumber: accountNo,
          accountName,
          amount,
          description: memo,
          orderCode: params.orderCode,
          qrCode: apiResult.data.qrCode || '',
          qrDataURL: apiResult.data.qrDataURL || quickLinkUrl,
          quickLinkUrl,
        };
      }
    } catch (error: any) {
      this.logger.warn(`Lỗi gọi VietQR API (${error.message}), chuyển sang dùng Quick Link dự phòng.`);
    }

    // Fallback nếu API có sự cố mạng
    return {
      bin,
      bankName: this.bankName,
      accountNumber: accountNo,
      accountName,
      amount,
      description: memo,
      orderCode: params.orderCode,
      qrCode: '',
      qrDataURL: quickLinkUrl,
      quickLinkUrl,
    };
  }

  /**
   * Gọi API POST https://api.vietqr.io/v2/generate
   */
  private callVietQRGenerateAPI(payload: {
    accountNo: string;
    accountName: string;
    acqId: string;
    amount: number;
    addInfo: string;
    format: string;
    template: string;
  }): Promise<any> {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify(payload);

      const options: https.RequestOptions = {
        hostname: 'api.vietqr.io',
        port: 443,
        path: '/v2/generate',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': this.clientId,
          'x-api-key': this.apiKey,
          'Content-Length': Buffer.byteLength(postData),
        },
      };

      const req = https.request(options, (res) => {
        let responseBody = '';
        res.on('data', (chunk) => {
          responseBody += chunk;
        });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseBody);
            resolve(parsed);
          } catch (e) {
            reject(new Error(`Không thể parse JSON từ VietQR API: ${responseBody}`));
          }
        });
      });

      req.on('error', (err) => {
        reject(err);
      });

      req.setTimeout(8000, () => {
        req.destroy(new Error('VietQR API timeout sau 8s'));
      });

      req.write(postData);
      req.end();
    });
  }
}
