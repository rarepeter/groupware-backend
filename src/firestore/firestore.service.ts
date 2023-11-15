import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../user/interface/user.interface';
import { AuthToken, UserAuthToken } from '../auth/interface/auth.interface';
import { getCurrentTimeInSeconds, oneWeekInSeconds } from '../lib/time';
import { InternalServerErrorHttpException } from '../api-http-exceptions/ApiHttpExceptions';
import { EditUserSelfDto, UserWithoutPassword } from '../user/dto/user.dto';
import { IFile } from '../file/interface/file.interface';
import { FieldValue } from 'firebase-admin/firestore';
import { CreateJobDto } from '../job/dto/job.dto';
import { Job } from '../job/interface/job.interface';
import { CreateVacationDto } from '../vacation/dto/vacation.dto';
import { Vacation } from '../vacation/interface/vacation.interface';
import {
  CreateContactUsRequestDto,
  CreateUserRequestDto,
} from '../request/dto/request.dto';
import {
  ContactUsRequest,
  UserRequest,
} from '../request/interface/request.interface';

@Injectable()
export class FirestoreService implements OnApplicationBootstrap {
  db: FirebaseFirestore.Firestore;

  private collectionNames: { [x: string]: string } = {
    VERIFICATION_CODES_COLLECTION: 'verification_codes',
    USER_AUTH_TOKENS_COLLECTION: 'user_auth_tokens',
    USERS_COLLECTION: 'users',
    USERS_AUTH_TOKENS_COLLECTION: 'auth_tokens',
    FILES_COLLECTION: 'files',
    JOBS_COLLECTION: 'jobs',
    VACATIONS_COLLECTION: 'users_vacations',
    CONTACT_US_REQUESTS_COLLECTION: 'contact_us_requests',
    USER_REQUESTS_COLLECTION: 'user_requests',
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
      {
        email: 'eric.andrei.1703@gmail.com',
        firstName: 'Eric-Andrei',
        lastName: 'Ailene',
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
        filesIds: [],
      };
      const docRef = usersCollectionRef.doc();
      batch.set(docRef, user);
    });

    await batch.commit();
  }

  // USER REQUESTS

  async createUserRequest(
    createRequestDto: CreateUserRequestDto,
    requesterId: User['userId'],
  ) {
    const userRequestsCollectionRef = this.db.collection(
      this.collectionNames.USER_REQUESTS_COLLECTION,
    );

    const newId = uuidv4();
    const userRequest: UserRequest = {
      ...createRequestDto,
      requesterId,
      requestId: newId,
    };

    await userRequestsCollectionRef.add(userRequest);

    const newRequestSnippet = await userRequestsCollectionRef
      .where('requestId', '==', newId)
      .get();

    if (newRequestSnippet.empty) return null;

    const docData = newRequestSnippet.docs[0].data() as UserRequest;

    return docData;
  }

  async applyToJob(jobId: Job['jobId'], applicantId: User['userId']) {
    const jobsCollectionRef = this.db.collection(
      this.collectionNames.JOBS_COLLECTION,
    );

    const jobSnippet = await jobsCollectionRef
      .where('jobId', '==', jobId)
      .get();

    if (jobSnippet === null) return null;

    await jobSnippet.docs[0].ref.update({
      applicants: FieldValue.arrayUnion(applicantId),
    });
  }

  // CONTACT US REQUESTS OPERATIONS

  async createContactUsRequest(
    createContactUsRequestDto: CreateContactUsRequestDto,
  ) {
    const contactUsRequestsCollectionRef = this.db.collection(
      this.collectionNames.CONTACT_US_REQUESTS_COLLECTION,
    );

    const contactUsRequest: ContactUsRequest = {
      ...createContactUsRequestDto,
      requestId: uuidv4(),
    };

    await contactUsRequestsCollectionRef.add(contactUsRequest);

    return contactUsRequest;
  }

  async getContactUsRequests() {
    const contactUsRequestsCollectionRef = this.db.collection(
      this.collectionNames.CONTACT_US_REQUESTS_COLLECTION,
    );

    const snippet = await contactUsRequestsCollectionRef.get();

    if (snippet.empty) return [];

    const docsData = snippet.docs.map((doc) => {
      const docData = doc.data() as ContactUsRequest;

      return docData;
    });

    return docsData;
  }

  // VACATIONS OPERATIONS

  async getUserVacations(userId: User['userId']) {
    const snippet = await this.db
      .collection(this.collectionNames.VACATIONS_COLLECTION)
      .where('userId', '==', userId)
      .get();

    if (snippet.empty) return [];

    const docsData = snippet.docs.map((doc) => {
      const docData = doc.data() as Vacation;

      return docData;
    });

    return docsData;
  }

  async createVacation(
    createVacationDto: CreateVacationDto,
    userId: User['userId'],
  ) {
    const vacationsCollectionRef = this.db.collection(
      this.collectionNames.VACATIONS_COLLECTION,
    );
    const currentTimeInSeconds = getCurrentTimeInSeconds();
    const vacationId = uuidv4();
    const newVacation: Vacation = {
      createdAtTimestamp: currentTimeInSeconds,
      createdByUserId: userId,
      vacationId,
      ...createVacationDto,
    };
    await vacationsCollectionRef.add(newVacation);

    const newVacationSnippet = await vacationsCollectionRef
      .where('vacationId', '==', vacationId)
      .get();

    if (newVacationSnippet.empty) return null;

    const newVacationData = newVacationSnippet.docs[0].data() as Vacation;

    return newVacationData;
  }

  // JOB OPERATIONS

  async getAllJobs() {
    const snippet = await this.db
      .collection(this.collectionNames.JOBS_COLLECTION)
      .get();

    if (snippet.empty) return [];

    const docsData = snippet.docs.map((doc) => {
      const docData = doc.data() as Job;

      return docData;
    });

    return docsData;
  }

  async createJob(createJobDto: CreateJobDto, createdByUserId: User['userId']) {
    const jobId = uuidv4();

    const currentTimeInSeconds = getCurrentTimeInSeconds();
    const newJob: Job = {
      applicants: [],
      createdAtTimestamp: currentTimeInSeconds,
      createdByUserId,
      jobId,
      ...createJobDto,
    };

    const createdJobRef = await this.db
      .collection(this.collectionNames.JOBS_COLLECTION)
      .add(newJob);
    const createdJobData = (await createdJobRef.get()).data() as Job;

    return createdJobData;
  }

  async deleteJob(jobId: Job['jobId']) {
    const snippet = await this.db
      .collection(this.collectionNames.JOBS_COLLECTION)
      .where('jobId', '==', jobId)
      .get();

    if (snippet.empty) return null;

    const docData = snippet.docs[0].data() as Job;

    await snippet.docs[0].ref.delete();

    return docData;
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

  async createUser(newUserDto: Omit<User, 'userId'>) {
    const usersCollectionRef = this.db.collection(
      this.collectionNames.USERS_COLLECTION,
    );

    const newUserId = uuidv4();

    const newUser: User = {
      ...newUserDto,
      userId: newUserId,
    };

    await usersCollectionRef.add(newUser);

    const newUserSnippet = await usersCollectionRef
      .where('userId', '==', newUserId)
      .get();

    if (newUserSnippet.empty) return null;

    const userData = newUserSnippet.docs[0].data() as User;

    const safeUserData: UserWithoutPassword = {
      contactNumber: userData.contactNumber,
      email: userData.email,
      filesIds: userData.filesIds,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      userId: userData.userId,
    };

    return safeUserData;
  }

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
      filesIds: userData.filesIds,
    };

    return userWithoutPassword;
  }

  async modifyUserSelf(userId: User['userId'], modifySelfDto: EditUserSelfDto) {
    const usersCollectionRef = this.db.collection(
      this.collectionNames.USERS_COLLECTION,
    );
    const userSnippet = await usersCollectionRef
      .where('userId', '==', userId)
      .get();

    if (userSnippet.empty) return null;

    const oldUserInfo = userSnippet.docs[0].data() as User;

    const newUserData: User = {
      ...oldUserInfo,
      ...modifySelfDto,
    };

    await userSnippet.docs[0].ref.update(newUserData);

    const newUserSnippet = await usersCollectionRef
      .where('userId', '==', userId)
      .get();

    if (newUserSnippet.empty) return null;

    const newUserInfo = newUserSnippet.docs[0].data() as User;

    return newUserInfo;
  }

  // FILES OPERATIONS

  async addPersonalFiles(files: IFile[]) {
    const fileCollectionRef = this.db.collection(
      this.collectionNames.FILES_COLLECTION,
    );
    const batch = this.db.batch();

    files.forEach((file) => {
      const docRef = fileCollectionRef.doc();
      batch.set(docRef, file);
    });

    await batch.commit();

    const createdFileIds = files.map((file) => file.fileId);

    const createdFilesSnippet = await fileCollectionRef
      .where('fileId', 'in', createdFileIds)
      .get();

    if (createdFilesSnippet.empty) return null;

    const userSnippet = await this.db
      .collection(this.collectionNames.USERS_COLLECTION)
      .where('userId', '==', files[0].uploadedByUserId)
      .get();

    if (userSnippet.empty) return null;

    await userSnippet.docs[0].ref.update({
      filesIds: FieldValue.arrayUnion(...createdFileIds),
    });

    const filesData = createdFilesSnippet.docs.map((doc) => {
      const docData = doc.data() as IFile;

      return docData;
    });

    return filesData;
  }

  async getUploadedFile(fileId: IFile['fileId']) {
    const snippet = await this.db
      .collection(this.collectionNames.FILES_COLLECTION)
      .where('fileId', '==', fileId)
      .get();

    if (snippet.empty) return null;

    const docData = snippet.docs[0].data() as IFile;

    return docData;
  }

  async getFilesByIds(fileIds: Array<IFile['fileId']>) {
    const snippet = await this.db
      .collection(this.collectionNames.FILES_COLLECTION)
      .where('fileId', 'in', fileIds)
      .get();

    if (snippet.empty) return [];

    const files: IFile[] = snippet.docs.map((doc) => {
      const docData = doc.data() as IFile;

      return docData;
    });

    return files;
  }
}
