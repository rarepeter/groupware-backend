import { Vacation } from '../interface/vacation.interface';

class CreateVacationDto
  implements Pick<Vacation, 'userId' | 'startDate' | 'endDate'>
{
  endDate: string;
  startDate: string;
  userId: string;
}

export { CreateVacationDto };
