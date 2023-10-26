import { IFile } from '../../file/interface/file.interface';
import {
  ContactNumber,
  Email,
  EncryptedPassword,
  UUID,
} from '../../types/global.type';

const allPossibleUserRoles = ['admin', 'employee', 'visitor'] as const;
type UserRole = (typeof allPossibleUserRoles)[number];

type User = {
  userId: UUID;
  firstName: string;
  lastName: string;
  role: UserRole;
  email: Email;
  password: EncryptedPassword;
  contactNumber: ContactNumber;
  filesIds: Array<IFile['fileId']>;
};

export { User, allPossibleUserRoles };
