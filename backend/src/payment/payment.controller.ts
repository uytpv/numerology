import { Controller, Post, Get, Body, Param, Headers, HttpCode, HttpStatus, BadRequestException, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ConfigService } from '@nestjs/config';

@Controller('api/v1/payments')
export class PaymentController {
  constructor(
    private paymentService: PaymentService,
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
   * Endpoint Xác nhận thanh toán & Giả lập môi trường Test Dev
   */
  @Post('dev-mock-pay')
  async simulatePayment(@Body() body: { orderCode: string | number }) {
    if (!body.orderCode) {
      throw new BadRequestException('Thiếu orderCode');
    }
    const result = await this.paymentService.processSuccessfulOrder(body.orderCode, {
      simulated: true,
      note: 'Thanh toán kích hoạt tự động qua VietQR ACB',
    });
    return { success: result, message: `Đã kích hoạt thành công đơn hàng #${body.orderCode}` };
  }

  /**
   * Alias cho confirm-payment
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
