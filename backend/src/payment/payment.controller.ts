import { Controller, Post, Get, Body, Param, Headers, HttpCode, HttpStatus, BadRequestException, Req, UseGuards, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PayOSService } from './payos.service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import * as crypto from 'crypto';

@Controller('api/v1/payments')
export class PaymentController {
  constructor(
    private paymentService: PaymentService,
    private payOSService: PayOSService,
    private configService: ConfigService,
  ) {}

  /**
   * Lấy danh sách các bảng giá B2C và B2B Coach
   */
  @Get('plans')
  getPricingPlans() {
    return this.paymentService.getPricingPlans();
  }

  /**
   * Tạo đơn thanh toán PayOS (Mã QR VietQR)
   */
  @Post('payos/create-link')
  async createPayOSLink(
    @Body() body: {
      planId: string;
      customerId?: string;
      userId?: string;
      userEmail?: string;
      cancelUrl?: string;
      returnUrl?: string;
    },
  ) {
    if (!body.planId) {
      throw new BadRequestException('Vui lòng chọn gói dịch vụ (planId)');
    }

    const cancelUrl = body.cancelUrl || 'http://localhost:3000?payment=cancelled';
    const returnUrl = body.returnUrl || 'http://localhost:3000?payment=success';
    const userId = body.userId || 'guest_user';

    return this.paymentService.createPayOSOrder({
      planId: body.planId,
      customerId: body.customerId,
      userId,
      userEmail: body.userEmail,
      cancelUrl,
      returnUrl,
    });
  }

  /**
   * Kiểm tra trạng thái đơn hàng (Polling / Real-time Sync)
   */
  @Get('order-status/:orderCode')
  async getOrderStatus(@Param('orderCode') orderCode: string) {
    return this.paymentService.getOrderStatus(orderCode);
  }

  /**
   * Endpoint nhận Webhook tự động từ PayOS khi khách chuyển khoản VietQR thành công
   */
  @Post('webhook/payos')
  @HttpCode(HttpStatus.OK)
  async handlePayOSWebhook(@Body() payload: any) {
    console.log('=== [WEBHOOK PAYOS NHẬN TÍN HIỆU] ===', JSON.stringify(payload));

    const isValidSignature = this.payOSService.verifyWebhookSignature(payload);
    if (!isValidSignature) {
      console.error('Chữ ký Webhook PayOS không hợp lệ!');
      throw new BadRequestException('Chữ ký Webhook PayOS không hợp lệ');
    }

    const data = payload?.data;
    if (data && payload.code === '00' && data.orderCode) {
      const orderCode = Number(data.orderCode);
      await this.paymentService.processSuccessfulOrder(orderCode, data);
      return { success: true, message: `Kích hoạt thành công đơn hàng #${orderCode}` };
    }

    return { success: true, message: 'Đã nhận webhook nhưng không có lệnh kích hoạt' };
  }

  /**
   * Endpoint nhận Webhook từ Lemon Squeezy (Thẻ quốc tế USD / EUR)
   */
  @Post('webhook/lemonsqueezy')
  @HttpCode(HttpStatus.OK)
  async handleLemonSqueezyWebhook(
    @Body() payload: any,
    @Headers('x-signature') signature: string,
    @Req() req: any
  ) {
    console.log('=== [WEBHOOK LEMON SQUEEZY NHẬN TÍN HIỆU] ===');

    const webhookSecret = this.configService.get<string>('LEMON_SQUEEZY_WEBHOOK_SECRET');
    if (webhookSecret && signature) {
      const rawBody = req.rawBody ? req.rawBody.toString() : JSON.stringify(payload);
      const hmac = crypto.createHmac('sha256', webhookSecret);
      const digest = hmac.update(rawBody).digest('hex');

      if (!crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(digest, 'hex'))) {
        console.error('Chữ ký Webhook Lemon Squeezy không hợp lệ!');
        throw new BadRequestException('Chữ ký Webhook không khớp');
      }
    }

    const eventName = payload?.meta?.event_name;
    const customData = payload?.meta?.custom_data;

    if (eventName === 'order_created') {
      const orderCode = Number(customData?.order_code || customData?.orderCode || Date.now());
      const customerId = customData?.customer_id;
      const tier = parseInt(customData?.tier, 10);

      // Nếu có sẵn đơn trong hệ thống
      if (customData?.order_code) {
        await this.paymentService.processSuccessfulOrder(Number(customData.order_code), payload);
      } else if (customerId && !isNaN(tier)) {
        // Luồng fallback unlock trực tiếp
        await this.paymentService.processSuccessfulOrder(orderCode, {
          customerId,
          targetTier: tier,
          payload,
        });
      }

      return { status: 'success', message: 'Kích hoạt thành công đơn hàng Lemon Squeezy' };
    }

    return { message: 'Đã nhận webhook' };
  }

  /**
   * Endpoint Test Giả lập Thanh toán nhanh trong môi trường Sandbox/Dev
   */
  @Post('dev-mock-pay')
  async simulatePayment(@Body() body: { orderCode: number }) {
    if (!body.orderCode) {
      throw new BadRequestException('Thiếu orderCode');
    }
    const result = await this.paymentService.processSuccessfulOrder(body.orderCode, {
      simulated: true,
      note: 'Thanh toán giả lập môi trường Test Dev',
    });
    return { success: result, message: `Đã kích hoạt giả lập thành công đơn hàng #${body.orderCode}` };
  }
}
