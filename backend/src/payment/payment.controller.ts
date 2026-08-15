import { Controller, Post, Body, Headers, HttpCode, HttpStatus, BadRequestException, RawBodyRequest, Req } from '@nestjs/common';
import { CustomersService } from '../customers/customers.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Controller('api/v1/payments')
export class PaymentController {
  constructor(
    private customersService: CustomersService,
    private configService: ConfigService,
  ) {}

  /**
   * Endpoint nhận Webhook từ Lemon Squeezy khi giao dịch hoàn tất
   */
  @Post('webhook/lemonsqueezy')
  @HttpCode(HttpStatus.OK)
  async handleLemonSqueezyWebhook(
    @Body() payload: any,
    @Headers('x-signature') signature: string,
    @Req() req: any // Cần raw body để xác thực chữ ký chính xác
  ) {
    console.log('--- NHẬN WEBHOOK LEMON SQUEEZY ---');
    
    // 1. Xác thực chữ ký webhook từ Lemon Squeezy (Nếu được cấu hình)
    const webhookSecret = this.configService.get<string>('LEMON_SQUEEZY_WEBHOOK_SECRET');
    if (webhookSecret && signature) {
      const rawBody = req.rawBody ? req.rawBody.toString() : JSON.stringify(payload);
      const hmac = crypto.createHmac('sha256', webhookSecret);
      const digest = hmac.update(rawBody).digest('hex');
      
      if (!crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(digest, 'hex'))) {
        console.error('Chữ ký Webhook Lemon Squeezy không hợp lệ!');
        throw new BadRequestException('Chữ ký Webhook không khớp');
      }
      console.log('Xác thực chữ ký Webhook thành công.');
    }

    // 2. Phân tích sự kiện Order
    const eventName = payload?.meta?.event_name;
    const customData = payload?.meta?.custom_data;

    console.log(`Event Name: ${eventName}`);
    console.log('Custom Data:', customData);

    if (eventName === 'order_created' || eventName === 'order_refunded') {
      const customerId = customData?.customer_id;
      const tier = parseInt(customData?.tier, 10);

      if (!customerId || isNaN(tier)) {
        console.warn('Thiếu thông tin customer_id hoặc tier trong custom_data!');
        return { message: 'Bỏ qua vì thiếu custom_data' };
      }

      if (eventName === 'order_created') {
        // Mở khóa các tính năng Premium
        await this.customersService.unlockTier(customerId, tier);
        return { status: 'success', message: `Đã mở khóa thành công Tier ${tier} cho khách hàng ${customerId}` };
      } else if (eventName === 'order_refunded') {
        // Khóa lại cấp độ (hạ về Tier 0 - Free)
        await this.customersService.unlockTier(customerId, 0);
        return { status: 'success', message: `Đã hoàn tiền và khóa lại tài khoản khách hàng ${customerId}` };
      }
    }

    return { message: 'Nhận sự kiện thành công nhưng không cần xử lý' };
  }
}
