import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Global()
@Module({
  providers: [
    {
      provide: 'FirebaseAdmin',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: config.get('FIREBASE_PROJECT_ID'),
            privateKey: config
              .get('FIREBASE_PRIVATE_KEY')
              .replace(/\\n/g, '\n'),
            clientEmail: config.get('FIREBASE_CLIENT_EMAIL'),
          }),
          databaseURL: config.get('FIREBASE_DATABASE_URL'),
        });

        return admin;
      },
    },
  ],
  exports: ['FirebaseAdmin'],
})
export class FirebaseModule {}
