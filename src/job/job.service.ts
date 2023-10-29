import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/job.dto';
import { User } from '../user/interface/user.interface';
import { FirestoreService } from '../firestore/firestore.service';
import { Job } from './interface/job.interface';

@Injectable()
export class JobService {
  constructor(private db: FirestoreService) {}

  async getAllJobs() {
    const jobs = await this.db.getAllJobs();

    return jobs;
  }

  async createJob(createJobDto: CreateJobDto, createdByUserId: User['userId']) {
    const createdJob = await this.db.createJob(createJobDto, createdByUserId);

    return createdJob;
  }

  async deleteJob(jobId: Job['jobId']) {
    const deletedJob = await this.db.deleteJob(jobId);

    return deletedJob;
  }
}
