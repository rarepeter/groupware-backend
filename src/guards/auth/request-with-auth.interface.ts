import { User } from '../../user/interface/user.interface';
import { Request } from 'express';

const allRequestWithAuthUserProperties = [
  'userId',
  'role',
  'email',
  'firstName',
  'lastName',
  'filesIds',
] as const;
type AuthenticatedUser = Pick<
  User,
  (typeof allRequestWithAuthUserProperties)[number]
>;

type RequestWithAuth = Request & { user: AuthenticatedUser };

export { RequestWithAuth, allRequestWithAuthUserProperties };
