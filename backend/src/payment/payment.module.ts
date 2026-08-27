import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { VietQRService } from './vietqr.service';
import { EmailService } from './email.service';
import { CustomersModule } from '../customers/customers.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [CustomersModule, FirebaseModule, ConfigModule],
  controllers: [PaymentController],
  providers: [PaymentService, VietQRService, EmailService],
  exports: [PaymentService, VietQRService, EmailService],
})
export class PaymentModule {}
