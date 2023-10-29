import { CalendarDate, SecondsTimestamp, UUID } from '../../types/global.type';
import { User } from '../../user/interface/user.interface';

type Vacation = {
  vacationId: UUID;
  userId: User['userId'];
  createdByUserId: User['userId'];
  createdAtTimestamp: SecondsTimestamp;
  startDate: CalendarDate;
  endDate: CalendarDate;
};

export { Vacation };
