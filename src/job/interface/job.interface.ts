import { SecondsTimestamp, UUID } from '../../types/global.type';
import { User } from '../../user/interface/user.interface';

type Job = {
  jobId: UUID;
  createdAtTimestamp: SecondsTimestamp;
  name: string;
  description: string;
  createdByUserId: User['userId'];
  applicants: Array<User['userId']>;
};

export { Job };
