import { Email, UUID } from '../../types/global.type';

type ContactUsRequest = {
  requestId: UUID;
  requesterName: string;
  requesterEmail: Email;
  requesterMessage: string;
};

export { ContactUsRequest };
