import { Injectable } from '@nestjs/common';
import { CreateContactUsRequestDto } from './dto/request.dto';
import { FirestoreService } from '../firestore/firestore.service';

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
}
