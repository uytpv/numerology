import { Controller, Post, Get, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser, UserPayload } from '../auth/decorators/current-user.decorator';
import { FirebaseService } from '../firebase/firebase.service';

@Controller('api/v1/customers')
@UseGuards(AuthGuard)
export class CustomersController {
  constructor(
    private customersService: CustomersService,
    private firebaseService: FirebaseService,
  ) {}

  /**
   * Tạo bản đồ và lưu thông tin khách hàng tra cứu
   */
  @Post()
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
