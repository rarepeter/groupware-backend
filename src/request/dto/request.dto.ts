import { ContactUsRequest, UserRequest } from '../interface/request.interface';

class CreateContactUsRequestDto implements Omit<ContactUsRequest, 'requestId'> {
  requesterName: string;
  requesterEmail: string;
  requesterMessage: string;
}

class CreateUserRequestDto
  implements Omit<UserRequest, 'requestId' | 'requesterId'>
{
  message: string;
}

export { CreateContactUsRequestDto, CreateUserRequestDto };
