import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RequestWithAuth } from '../guards/auth/request-with-auth.interface';
import { constructResponseJson } from '../lib/respones';
import { InternalServerErrorHttpException } from '../api-http-exceptions/ApiHttpExceptions';
import { AuthenticationGuard } from '../guards/auth/auth.guard';

@UseGuards(AuthenticationGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  async getUserPersonalInfo(@Req() requestWithAuth: RequestWithAuth) {
    const {
      user: { userId },
    } = requestWithAuth;

    const userInfo = await this.userService.getUserPersonalInfo(userId);

    if (userInfo === null) throw new InternalServerErrorHttpException();

    return constructResponseJson(userInfo);
  }
}
