import { IsEmail, IsString } from 'class-validator';
import {
  Email,
  PlainPassword,
  SecondsTimestamp,
} from '../../types/global.type';
import { User } from '../../user/interface/user.interface';

class AuthDto {
  @IsEmail()
  email: Email;
  @IsString()
  password: PlainPassword;
}

class SignUpDto {
  @IsEmail()
  email: Email;
  @IsString()
  password: PlainPassword;
}

type JwtAuthToken = string;

type AuthToken = JwtAuthToken;

type UserAuthToken = {
  userId: User['userId'];
  authToken: AuthToken;
  createdAtTimestamp: SecondsTimestamp;
  expiresAtTimestamp: SecondsTimestamp;
};

export { AuthDto, AuthToken, UserAuthToken, SignUpDto };
