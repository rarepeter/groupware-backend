import { Injectable } from '@nestjs/common';
import { FirestoreService } from '../firestore/firestore.service';
import { AuthDto, SignUpDto } from './interface/auth.interface';
import {
  FrontEndUserDto,
  allUserFrontEndDtoProperties,
} from '../user/dto/user.dto';
import { createDto } from '../lib/dto';
import * as bcrypt from 'bcrypt';
import {
  InternalServerErrorHttpException,
  InvalidCredentialsHttpException,
} from '../api-http-exceptions/ApiHttpExceptions';
import { User } from '../user/interface/user.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class AuthService {
  private isProduction: boolean;
  private authCookieName = 'auth_token';

  constructor(
    private db: FirestoreService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {
    this.isProduction = this.config.get('NODE_ENV') === 'prod';
  }

  async signIn(authDto: AuthDto, response: Response) {
    const dangerouslyVulnerableUser = await this.db.dangerouslyGetUserByEmail(
      authDto.email,
    );

    if (dangerouslyVulnerableUser === null) return null;

    const frontEndUserDto: FrontEndUserDto = createDto(
      dangerouslyVulnerableUser,
      allUserFrontEndDtoProperties,
    );

    const pwMatch = await bcrypt.compare(
      authDto.password,
      dangerouslyVulnerableUser.password,
    );

    if (!pwMatch) throw new InvalidCredentialsHttpException();

    const userSignedToken = await this.signJwtToken(
      dangerouslyVulnerableUser.userId,
    );

    await this.db.saveUserAuthToken(
      dangerouslyVulnerableUser.userId,
      userSignedToken,
    );

    response.cookie(this.authCookieName, userSignedToken, {
      httpOnly: true,
      secure: this.isProduction,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return frontEndUserDto;
  }

  async signUp(signUpDto: SignUpDto, response: Response) {
    const dangerouslyVulnerableUser = await this.db.dangerouslyGetUserByEmail(
      signUpDto.email,
    );

    if (dangerouslyVulnerableUser !== null)
      throw new InternalServerErrorHttpException();

    const encryptedUserPassword = await bcrypt.hash(signUpDto.password, 3);

    const newUserDto: Omit<User, 'userId'> = {
      contactNumber: '',
      email: signUpDto.email,
      filesIds: [],
      firstName: '',
      lastName: '',
      password: encryptedUserPassword,
      role: 'visitor',
    };

    const createdUser = await this.db.createUser(newUserDto);

    if (createdUser !== null) {
      const userSignedToken = await this.signJwtToken(createdUser.userId);

      response.cookie(this.authCookieName, userSignedToken, {
        httpOnly: true,
        secure: this.isProduction,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      await this.db.saveUserAuthToken(createdUser.userId, userSignedToken);

      const userFrontEndDto: FrontEndUserDto = {
        contactNumber: createdUser.contactNumber,
        email: createdUser.email,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        role: createdUser.role,
        userId: createdUser.userId,
      };

      return userFrontEndDto;
    }

    return createdUser;
  }

  async signOut(response: Response, userId: User['userId']) {
    await this.db.deleteUserAuthToken(userId);

    response.clearCookie(this.authCookieName);

    return;
  }

  async signJwtToken(userId: User['userId']) {
    const signedToken = await this.jwtService.signAsync(
      { sub: userId },
      { expiresIn: '7d' },
    );

    return signedToken;
  }

  async saveAuthToken() {}
}
