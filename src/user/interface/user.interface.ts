import {
  ContactNumber,
  Email,
  EncryptedPassword,
  UUID,
} from '../../types/global.type';

const allPossibleUserRoles = ['admin', 'employee', 'visitor'];
type UserRole = (typeof allPossibleUserRoles)[number];

type User = {
  userId: UUID;
  firstName: string;
  lastName: string;
  role: UserRole;
  email: Email;
  password: EncryptedPassword;
  contactNumber: ContactNumber;
};

export { User, allPossibleUserRoles };
