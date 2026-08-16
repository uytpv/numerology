import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PayOSService } from './payos.service';
import { CustomersModule } from '../customers/customers.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [CustomersModule, FirebaseModule, ConfigModule],
  controllers: [PaymentController],
  providers: [PaymentService, PayOSService],
  exports: [PaymentService, PayOSService],
})
export class PaymentModule {}
