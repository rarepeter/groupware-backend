import { Injectable } from '@nestjs/common';
import {
  CreateContactUsRequestDto,
  CreateUserRequestDto,
} from './dto/request.dto';
import { FirestoreService } from '../firestore/firestore.service';
import { User } from '../user/interface/user.interface';

@Injectable()
export class RequestService {
  constructor(private db: FirestoreService) {}

  async createContactUsRequest(
    createContactUsRequestDto: CreateContactUsRequestDto,
  ) {
    const createdContactUsRequest = await this.db.createContactUsRequest(
      createContactUsRequestDto,
    );

    return createdContactUsRequest;
  }

  async getContactUsRequests() {
    const contactUsRequests = await this.db.getContactUsRequests();

    return contactUsRequests;
  }

  async createUserRequest(
    createRequestDto: CreateUserRequestDto,
    requesterId: User['userId'],
  ) {
    const createdUserRequest = await this.db.createUserRequest(
      createRequestDto,
      requesterId,
    );

    return createdUserRequest;
  }
}
