import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { CustomersModule } from '../customers/customers.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [CustomersModule, ConfigModule],
  controllers: [PaymentController],
})
export class PaymentModule {}
