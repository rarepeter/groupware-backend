import { Injectable } from '@nestjs/common';
import { User } from './interface/user.interface';
import { FirestoreService } from '../firestore/firestore.service';
import { EditUserSelfDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private db: FirestoreService) {}

  async getUserPersonalInfo(userId: User['userId']) {
    const userInfo = await this.db.getUser(userId);

    return userInfo;
  }

  async modifyUserSelf(userId: User['userId'], modifySelfDto: EditUserSelfDto) {
    const userModifiedInfo = await this.db.modifyUserSelf(
      userId,
      modifySelfDto,
    );

    return userModifiedInfo;
  }
}
