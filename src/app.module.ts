import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FirebaseModule } from './firebase/firebase.module';
import { FirestoreModule } from './firestore/firestore.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { FileModule } from './file/file.module';
import { JobModule } from './job/job.module';
import { RequestModule } from './request/request.module';
import { VacationModule } from './vacation/vacation.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    FirebaseModule,
    FirestoreModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY as string,
    }),
    FileModule,
    JobModule,
    RequestModule,
    VacationModule,
  ],
})
export class AppModule {}
