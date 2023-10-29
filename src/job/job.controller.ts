import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JobService } from './job.service';
import { RequestWithAuth } from '../guards/auth/request-with-auth.interface';
import { CreateJobDto } from './dto/job.dto';
import { Job } from './interface/job.interface';
import { constructResponseJson } from '../lib/respones';
import { InternalServerErrorHttpException } from '../api-http-exceptions/ApiHttpExceptions';
import { AuthenticationGuard } from '../guards/auth/auth.guard';

@UseGuards(AuthenticationGuard)
@Controller('jobs')
export class JobController {
  constructor(private jobService: JobService) {}

  @Get()
  async getJobs() {
    const jobs = await this.jobService.getAllJobs();

    return constructResponseJson(jobs);
  }

  @Post('new')
  async createJob(
    @Req() requestWithAuth: RequestWithAuth,
    @Body() createJobDto: CreateJobDto,
  ) {
    const {
      user: { userId },
    } = requestWithAuth;

    const createdJob = await this.jobService.createJob(createJobDto, userId);

    if (createdJob === null) throw new InternalServerErrorHttpException();

    return constructResponseJson(createdJob);
  }

  @Delete(':jobId')
  async deleteJob(
    @Req() requestWithAuth: RequestWithAuth,
    @Param('jobId') jobId: Job['jobId'],
  ) {
    const deletedJob = await this.jobService.deleteJob(jobId);

    if (deletedJob === null) throw new InternalServerErrorHttpException();

    return constructResponseJson(deletedJob);
  }
}
