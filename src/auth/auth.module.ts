import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FirestoreModule } from '../firestore/firestore.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [FirestoreModule],
  exports: [AuthModule],
})
export class AuthModule {}
