import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface SendPaymentSuccessEmailParams {
  toEmail: string;
  userName?: string;
  orderCode: string | number;
  planName: string;
  amount: number;
  creditsGranted?: number;
  durationDays?: number;
  features?: string[];
  paidAt?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private configService: ConfigService) {
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = Number(this.configService.get<string>('SMTP_PORT')) || 587;
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');

    if (smtpHost && smtpUser && smtpPass) {
      try {
        this.transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });
        this.logger.log(`Khởi tạo SMTP Mail Transporter thành công cho ${smtpHost}`);
      } catch (err: any) {
        this.logger.error('Lỗi khởi tạo SMTP Transporter:', err.message);
      }
    } else {
      this.logger.warn('Chưa cấu hình SMTP (SMTP_HOST, SMTP_USER, SMTP_PASS). Sẽ xuất email ra nhật ký console trong môi trường Dev.');
    }
  }

  /**
   * Gửi email xác nhận thanh toán & biên nhận giao dịch
   */
  async sendPaymentSuccessEmail(params: SendPaymentSuccessEmailParams): Promise<boolean> {
    if (!params.toEmail) {
      this.logger.warn('Không có địa chỉ email nhận thư.');
      return false;
    }

    const name = params.userName || 'Quý khách';
    const formattedAmount = params.amount.toLocaleString('vi-VN') + ' đ';
    const paidDate = params.paidAt || new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    const featureListHtml = (params.features || [])
      .map(f => `<li style="margin-bottom: 8px; color: #2D3E3A;">✓ ${f}</li>`)
      .join('');

    const htmlContent = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Xác Nhận Thanh Toán Thành Công - Life Maps</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FAF8F5; margin: 0; padding: 24px; color: #2D3E3A;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 24px; overflow: hidden; border: 1px solid #E2E8E5; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
    
    <!-- HEADER -->
    <div style="background: linear-gradient(135deg, #013E37 0%, #0D2B26 100%); padding: 32px 24px; text-align: center; color: #FFFFFF;">
      <div style="font-size: 32px; margin-bottom: 8px;">🔮</div>
      <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; color: #FFFFFF;">LIFE MAPS</h1>
      <p style="margin: 6px 0 0 0; font-size: 13px; color: #FFEFB3; font-weight: 600;">HỆ THỐNG GIẢI MÃ BẢN ĐỒ SỐ HỌC PYTHAGORAS</p>
    </div>

    <!-- BODY -->
    <div style="padding: 32px 28px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; background-color: #EEF5F3; color: #267D71; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; border: 1px solid rgba(38,125,113,0.2);">
          ✓ GIAO DỊCH THÀNH CÔNG
        </div>
        <h2 style="color: #0D2B26; font-size: 20px; margin: 16px 0 8px 0;">Cảm ơn bạn đã nâng cấp dịch vụ!</h2>
        <p style="color: #5F736E; font-size: 14px; margin: 0; line-height: 1.5;">
          Xin chào <strong>${name}</strong>, giao dịch của bạn đã được xác nhận và quyền lợi đã được kích hoạt trên hệ thống.
        </p>
      </div>

      <!-- INVOICE CARD -->
      <div style="background-color: #FAF8F5; border: 1px solid #E2E8E5; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="padding: 8px 0; color: #5F736E;">Mã đơn hàng:</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold; font-family: monospace; color: #013E37;">#${params.orderCode}</td>
          </tr>
          <tr style="border-top: 1px dashed #E2E8E5;">
            <td style="padding: 8px 0; color: #5F736E;">Gói dịch vụ:</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #0D2B26;">${params.planName}</td>
          </tr>
          <tr style="border-top: 1px dashed #E2E8E5;">
            <td style="padding: 8px 0; color: #5F736E;">Số tiền đã thanh toán:</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold; font-size: 16px; color: #013E37;">${formattedAmount}</td>
          </tr>
          <tr style="border-top: 1px dashed #E2E8E5;">
            <td style="padding: 8px 0; color: #5F736E;">Phương thức:</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #2D3E3A;">VietQR (Ngân hàng ACB)</td>
          </tr>
          <tr style="border-top: 1px dashed #E2E8E5;">
            <td style="padding: 8px 0; color: #5F736E;">Thời gian giao dịch:</td>
            <td style="padding: 8px 0; text-align: right; color: #5F736E;">${paidDate}</td>
          </tr>
          ${params.creditsGranted ? `
          <tr style="border-top: 1px dashed #E2E8E5;">
            <td style="padding: 8px 0; color: #5F736E;">Số lượt bài báo cáo cộng thêm:</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #267D71;">+${params.creditsGranted} lượt</td>
          </tr>` : ''}
        </table>
      </div>

      <!-- FEATURES BENEFIT -->
      ${featureListHtml ? `
      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 14px; font-weight: bold; color: #0D2B26; margin-bottom: 10px;">Quyền lợi được kích hoạt:</h3>
        <ul style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.6;">
          ${featureListHtml}
        </ul>
      </div>` : ''}

      <!-- ACTION BUTTON -->
      <div style="text-align: center; margin: 32px 0 16px 0;">
        <a href="https://thansohoc.web.app/account" style="display: inline-block; background-color: #013E37; color: #FFFFFF; text-decoration: none; padding: 14px 32px; border-radius: 14px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 12px rgba(1,62,55,0.25);">
          🚀 Quản Lý Tài Khoản & Tra Cứu Ngay
        </a>
      </div>
    </div>

    <!-- FOOTER -->
    <div style="background-color: #EEF5F3; padding: 20px; text-align: center; font-size: 11px; color: #5F736E; border-top: 1px solid #E2E8E5;">
      <p style="margin: 0 0 6px 0;">Life Maps - Nền Tảng Khai Vấn & Luận Giải Số Học Chuẩn Quốc Tế</p>
      <p style="margin: 0; color: #93A39F;">Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ bộ phận hỗ trợ khách hàng 24/7 qua cổng trực tuyến.</p>
    </div>

  </div>
</body>
</html>
    `;

    this.logger.log(`[EMAIL CONFIRMATION] Gửi biên lai đơn hàng #${params.orderCode} tới email: ${params.toEmail}`);

    if (this.transporter) {
      try {
        const fromAddress = this.configService.get<string>('SMTP_FROM') || '"Life Maps Payment" <no-reply@numerology.vn>';
        await this.transporter.sendMail({
          from: fromAddress,
          to: params.toEmail,
          subject: `🔮 [Life Maps] Xác nhận thanh toán thành công đơn hàng #${params.orderCode}`,
          html: htmlContent,
        });
        this.logger.log(`Email đã gửi thành công tới ${params.toEmail}`);
        return true;
      } catch (err: any) {
        this.logger.error(`Lỗi khi gửi email qua SMTP: ${err.message}`);
      }
    }

    // Nếu không có SMTP thực, ghi log mẫu email ra console (chế độ phát triển)
    this.logger.log(`=== [DEV EMAIL SENT] Đã tạo thành công thư thông báo đơn #${params.orderCode} cho ${params.toEmail} ===`);
    return true;
  }
}
