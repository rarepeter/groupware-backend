import { Injectable } from '@nestjs/common';
import { CreateVacationDto } from './dto/vacation.dto';
import { User } from '../user/interface/user.interface';
import { FirestoreService } from '../firestore/firestore.service';

@Injectable()
export class VacationService {
  constructor(private db: FirestoreService) {}

  async getUserVacations(userId: User['userId']) {
    const vacations = await this.db.getUserVacations(userId);

    return vacations;
  }

  async createVacation(
    createVacationDto: CreateVacationDto,
    userId: User['userId'],
  ) {
    const createdVacation = await this.db.createVacation(
      createVacationDto,
      userId,
    );

    return createdVacation;
  }
}
