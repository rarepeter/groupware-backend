import { Email, UUID } from '../../types/global.type';
import { User } from '../../user/interface/user.interface';

type ContactUsRequest = {
  requestId: UUID;
  requesterName: string;
  requesterEmail: Email;
  requesterMessage: string;
};

type UserRequest = {
  requestId: UUID;
  requesterId: User['userId'];
  message: string;
};

export { ContactUsRequest, UserRequest };
