import { Controller, Post, Get, Body, Param, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser, UserPayload } from '../auth/decorators/current-user.decorator';
import { FirebaseService } from '../firebase/firebase.service';

@Controller('api/v1/customers')
export class CustomersController {
  constructor(
    private customersService: CustomersService,
    private firebaseService: FirebaseService,
  ) {}

  /**
   * Tính toán toàn bộ 21 chỉ số Pythagoras chuẩn hóa (Single Source of Truth)
   * Public endpoint: Dành cho cả Guest lẫn User đã đăng nhập
   */
  @Post('calculate')
  calculate(@Body() body: { fullName: string; dob: string; gender?: string }) {
    if (!body?.fullName || !body?.dob) {
      throw new BadRequestException('Vui lòng cung cấp đầy đủ fullName và dob');
    }
    return this.customersService.calculateFullNumerologyProfile(body.fullName, body.dob, body.gender);
  }

  /**
   * Tạo bản đồ và lưu thông tin khách hàng tra cứu (Bảo vệ bằng AuthGuard)
   */
  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() dto: CreateCustomerDto,
    @CurrentUser() user: any,
  ) {
    return this.customersService.create(dto, user.uid);
  }

  /**
   * Lấy thông tin bản đồ tính toán chi tiết của khách hàng
   */
  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    const isAdmin = await this.checkAdminRole(user.uid);
    return this.customersService.findOne(id, user.uid, isAdmin);
  }

  /**
   * Lấy báo cáo phân tích bằng AI dựa theo ngôn ngữ và Tier mở khóa
   */
  @Get(':id/report')
  @UseGuards(AuthGuard)
  async getReport(
    @Param('id') id: string,
    @Query('tier') tier: string,
    @Query('lang') lang: string,
    @CurrentUser() user: any,
  ) {
    const tierNum = parseInt(tier, 10) || 0;
    const language = lang || 'vi';
    const isAdmin = await this.checkAdminRole(user.uid);
    
    return this.customersService.getAIReport(id, tierNum, language, user.uid, isAdmin);
  }

  /**
   * Helper kiểm tra nhanh xem user hiện tại có quyền admin hay không
   */
  private async checkAdminRole(uid: string): Promise<boolean> {
    try {
      const doc = await this.firebaseService.db().collection('users').doc(uid).get();
      if (doc.exists) {
        const data = doc.data();
        return data?.role === 'admin';
      }
    } catch (error) {
      console.error('Lỗi check role admin:', error.message);
    }
    return false;
  }
}
