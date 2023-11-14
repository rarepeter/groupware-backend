import { ContactUsRequest } from '../interface/request.interface';

class CreateContactUsRequestDto implements Omit<ContactUsRequest, 'requestId'> {
  requesterName: string;
  requesterEmail: string;
  requesterMessage: string;
}

export { CreateContactUsRequestDto };
