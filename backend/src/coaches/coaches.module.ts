import { Module } from '@nestjs/common';
import { CoachesController } from './coaches.controller';
import { CoachesService } from './coaches.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { AIModule } from '../ai/ai.module';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [FirebaseModule, AIModule, CustomersModule],
  controllers: [CoachesController],
  providers: [CoachesService],
  exports: [CoachesService],
})
export class CoachesModule {}
