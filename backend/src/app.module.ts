import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { AIModule } from './ai/ai.module';
import { CustomersModule } from './customers/customers.module';
import { PaymentModule } from './payment/payment.module';
import { CoachesModule } from './coaches/coaches.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FirebaseModule,
    AIModule,
    CustomersModule,
    PaymentModule,
    CoachesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
