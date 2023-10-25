import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FirestoreService {
  db: FirebaseFirestore.Firestore;

  private collectionNames: { [x: string]: string } = {
    VERIFICATION_CODES_COLLECTION: 'verification_codes',
    USERS_COLLECTION: 'users',
    USERS_AUTH_TOKENS_COLLECTION: 'auth_tokens',
    FILES_COLLECTION: 'files',
  };

  constructor(
    @Inject('FirebaseAdmin')
    private admin: admin.app.App,
  ) {
    this.db = admin.firestore();
  }
}
