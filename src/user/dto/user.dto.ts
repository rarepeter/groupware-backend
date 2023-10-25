import { IsEmail, IsIn, IsString, MaxLength } from 'class-validator';
import { User, allPossibleUserRoles } from '../interface/user.interface';
import { PlainPassword } from '../../types/global.type';

const firstNameMaxLength = 40;
const lastNameMaxLength = 40;
const contactNumberMaxLength = 15;
const passwordMaxLength = 32;

class CreateUserDtoAdmin
  implements
    Pick<User, 'firstName' | 'lastName' | 'contactNumber' | 'email' | 'role'>
{
  @IsEmail()
  email: User['email'];
  @MaxLength(firstNameMaxLength)
  firstName: User['firstName'];
  @MaxLength(lastNameMaxLength)
  lastName: User['lastName'];
  @MaxLength(contactNumberMaxLength)
  contactNumber: User['contactNumber'];
  @IsIn(allPossibleUserRoles)
  role: User['role'];
}

class CreateUserDtoVisitor implements Pick<User, 'email' | 'password'> {
  @IsEmail()
  email: User['email'];
  @IsString()
  @MaxLength(passwordMaxLength)
  password: PlainPassword;
}

class EditUserSelfDto
  implements Pick<User, 'email' | 'firstName' | 'lastName' | 'contactNumber'>
{
  @MaxLength(contactNumberMaxLength)
  contactNumber: User['contactNumber'];
  @IsEmail()
  email: User['email'];
  @MaxLength(firstNameMaxLength)
  firstName: User['firstName'];
  @MaxLength(lastNameMaxLength)
  lastName: User['lastName'];
}

export { CreateUserDtoAdmin, CreateUserDtoVisitor, EditUserSelfDto };
