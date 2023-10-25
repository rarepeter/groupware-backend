import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FirebaseModule } from './firebase/firebase.module';
import { FirestoreModule } from './firestore/firestore.module';

@Module({
  imports: [UserModule, AuthModule, FirebaseModule, FirestoreModule],
})
export class AppModule {}
