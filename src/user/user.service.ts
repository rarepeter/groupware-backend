import { Injectable } from '@nestjs/common';
import { User } from './interface/user.interface';
import { FirestoreService } from '../firestore/firestore.service';

@Injectable()
export class UserService {
  constructor(private db: FirestoreService) {}

  async getUserPersonalInfo(userId: User['userId']) {
    const userInfo = await this.db.getUser(userId);

    return userInfo;
  }
}
