import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../user/interface/user.interface';
import { AuthToken, UserAuthToken } from '../auth/interface/auth.interface';
import { getCurrentTimeInSeconds, oneWeekInSeconds } from '../lib/time';
import { InternalServerErrorHttpException } from '../api-http-exceptions/ApiHttpExceptions';
import { UserWithoutPassword } from '../user/dto/user.dto';

@Injectable()
export class FirestoreService implements OnApplicationBootstrap {
  db: FirebaseFirestore.Firestore;

  private collectionNames: { [x: string]: string } = {
    VERIFICATION_CODES_COLLECTION: 'verification_codes',
    USER_AUTH_TOKENS_COLLECTION: 'user_auth_tokens',
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

  async onApplicationBootstrap() {
    const usersCollectionRef = this.db.collection(
      this.collectionNames.USERS_COLLECTION,
    );

    const usersSnippet = await usersCollectionRef.get();

    if (!usersSnippet.empty) return;

    const userEmailsSeed = [
      {
        email: 'gal.alexandra.gabriela@gmail.com',
        firstName: 'Alexandra-Gabriela',
        lastName: 'Gal',
      },
      {
        email: 'cebanudorin2002@gmail.com',
        firstName: 'Dorin',
        lastName: 'Cebanu',
      },
      {
        email: 'aburuiana25@gmail.com',
        firstName: 'Alexandru',
        lastName: 'Buruiana',
      },
      {
        email: 'sabyna.boleac@gmail.com',
        firstName: 'Sabina',
        lastName: 'Boleac',
      },
      {
        email: 'danieljitariu21@gmail.com',
        firstName: 'Daniel-Marian',
        lastName: 'Jitariu',
      },
      {
        email: 'andreichirvase30@yahoo.com',
        firstName: 'Andrei',
        lastName: 'Chirvase',
      },
      {
        email: 'contact@petergamali.com',
        firstName: 'Petru',
        lastName: 'Gamali',
      },
    ];

    const batch = this.db.batch();

    userEmailsSeed.forEach((userSeedData) => {
      const newUserId = uuidv4();
      const user: User = {
        userId: newUserId,
        contactNumber: '+40',
        email: userSeedData.email,
        firstName: userSeedData.firstName,
        lastName: userSeedData.lastName,
        password:
          '$2a$04$4JywnWUJC1/AtZf8uiNzTuNOZ8ge/QVoNxCLjmkzqh1PlbtEOqVEy',
        role: 'admin',
      };
      const docRef = usersCollectionRef.doc();
      batch.set(docRef, user);
    });

    await batch.commit();
  }

  // AUTH TOKENS OPERATIONS

  async saveUserAuthToken(userId: User['userId'], authToken: AuthToken) {
    const collectionRef = this.db.collection(
      this.collectionNames.USER_AUTH_TOKENS_COLLECTION,
    );

    const existingToken = await collectionRef
      .where('userId', '==', userId)
      .get();

    const currentTimeInSeconds = getCurrentTimeInSeconds();

    if (!existingToken.empty) {
      await existingToken.docs[0].ref.delete();
    }

    const userAuthToken: UserAuthToken = {
      authToken,
      userId,
      createdAtTimestamp: currentTimeInSeconds,
      expiresAtTimestamp: currentTimeInSeconds + oneWeekInSeconds,
    };

    await collectionRef.add(userAuthToken);

    return userAuthToken;
  }

  async getUserAuthToken(userId: User['userId']) {
    const snippet = await this.db
      .collection(this.collectionNames.USER_AUTH_TOKENS_COLLECTION)
      .where('userId', '==', userId)
      .get();

    if (snippet.empty) return null;

    const userAuthTokenData = snippet.docs[0].data() as UserAuthToken;

    const currentTimeInSeconds = getCurrentTimeInSeconds();

    if (userAuthTokenData.expiresAtTimestamp < currentTimeInSeconds) {
      await snippet.docs[0].ref.delete();

      return null;
    }

    return userAuthTokenData.authToken;
  }

  async deleteUserAuthToken(userId: User['userId']) {
    const snippet = await this.db
      .collection(this.collectionNames.USER_AUTH_TOKENS_COLLECTION)
      .where('userId', '==', userId)
      .get();

    if (snippet.empty) return;

    await snippet.docs[0].ref.delete();

    return;
  }

  // USERS OPERATIONS

  async dangerouslyGetUserByEmail(userEmail: User['email']) {
    const snippet = await this.db
      .collection(this.collectionNames.USERS_COLLECTION)
      .where('email', '==', userEmail)
      .get();

    if (snippet.empty) return null;

    const docData = snippet.docs[0].data() as User;

    return docData;
  }

  async getUser(userId: User['userId']) {
    const snippet = await this.db
      .collection(this.collectionNames.USERS_COLLECTION)
      .where('userId', '==', userId)
      .get();

    if (snippet.empty) return null;

    const userData = snippet.docs[0].data() as User;

    const userWithoutPassword: UserWithoutPassword = {
      contactNumber: userData.contactNumber,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      userId: userData.userId,
    };

    return userWithoutPassword;
  }
}
