import { Controller, Post, Get, Body, Param, Headers, HttpCode, HttpStatus, BadRequestException, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ConfigService } from '@nestjs/config';
import { SePayService } from './sepay.service';

@Controller('api/v1/payments')
export class PaymentController {
  constructor(
    private paymentService: PaymentService,
    private configService: ConfigService,
    private sePayService: SePayService,
  ) {}

  /**
   * Lấy danh sách các bảng giá B2C và B2B Coach
   */
  @Get('plans')
  getPricingPlans() {
    return this.paymentService.getPricingPlans();
  }

  /**
   * Tạo đơn thanh toán VietQR (Ngân hàng ACB - TRA PHUC VINH UY - Template hjTz6tf)
   */
  @Post('vietqr/create-link')
  async createVietQRLink(
    @Body() body: {
      planId: string;
      customerId?: string;
      userId?: string;
      userEmail?: string;
      userName?: string;
    },
  ) {
    if (!body.planId) {
      throw new BadRequestException('Vui lòng chọn gói dịch vụ (planId)');
    }

    const userId = body.userId || 'guest_user';

    return this.paymentService.createVietQROrder({
      planId: body.planId,
      customerId: body.customerId,
      userId,
      userEmail: body.userEmail,
      userName: body.userName,
    });
  }

  /**
   * Endpoint tương thích ngược cho payos/create-link
   */
  @Post('payos/create-link')
  async createPayOSLinkLegacy(
    @Body() body: {
      planId: string;
      customerId?: string;
      userId?: string;
      userEmail?: string;
      userName?: string;
    },
  ) {
    return this.createVietQRLink(body);
  }

  /**
   * Kiểm tra trạng thái đơn hàng (Polling / Real-time Sync)
   */
  @Get('order-status/:orderCode')
  async getOrderStatus(@Param('orderCode') orderCode: string) {
    return this.paymentService.getOrderStatus(orderCode);
  }

  /**
   * Lấy danh sách lịch sử tất cả các giao dịch của người dùng
   */
  @Get('user-transactions/:userId')
  async getUserTransactions(@Param('userId') userId: string) {
    if (!userId) {
      throw new BadRequestException('Thiếu userId');
    }
    return this.paymentService.getUserTransactions(userId);
  }

  /**
   * Endpoint SePay Webhook nhận biến động số dư ngân hàng ACB tự động
   * POST /api/v1/payments/sepay/webhook hoặc /api/v1/payments/webhook
   */
  @Post('sepay/webhook')
  @HttpCode(HttpStatus.OK)
  async handleSePayWebhook(
    @Body() payload: any,
    @Headers('authorization') authHeader?: string,
  ) {
    return this.sePayService.processWebhook(payload, authHeader);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleGeneralWebhook(
    @Body() payload: any,
    @Headers('authorization') authHeader?: string,
  ) {
    return this.sePayService.processWebhook(payload, authHeader);
  }

  /**
   * Endpoint Test Sandbox dành riêng cho Merchant SePay test kiểm thử
   */
  @Post('sepay/test-simulate')
  async simulateSePayTestTransaction(
    @Body() body: { orderCode: string; amount?: number; gateway?: string }
  ) {
    if (!body.orderCode) {
      throw new BadRequestException('Thiếu orderCode để giả lập test');
    }
    const orderDoc = await this.paymentService.getOrderStatus(body.orderCode);
    const amount = body.amount || (orderDoc?.order?.amount) || 200000;
    
    return this.sePayService.processWebhook({
      id: Math.floor(100000 + Math.random() * 900000),
      gateway: body.gateway || 'ACB',
      transactionDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
      accountNumber: '12688937',
      content: `TSH${body.orderCode.replace(/^TSH/i, '')} chuyen khoan thanh toan`,
      transferType: 'in',
      transferAmount: amount,
    });
  }

  /**
   * Endpoint Xác nhận thanh toán qua Admin Dashboard
   */
  @Post('confirm-payment')
  async confirmPayment(@Body() body: { orderCode: string | number; transactionId?: string }) {
    if (!body.orderCode) {
      throw new BadRequestException('Thiếu orderCode');
    }
    const result = await this.paymentService.processSuccessfulOrder(body.orderCode, {
      confirmed: true,
      transactionId: body.transactionId,
      gateway: 'VIETQR_ACB',
    });
    return { success: result, message: `Kích hoạt thành công đơn hàng #${body.orderCode}` };
  }
}
