import { Job } from '../interface/job.interface';

class CreateJobDto implements Pick<Job, 'name' | 'description'> {
  description: string;
  name: string;
}

export { CreateJobDto };
