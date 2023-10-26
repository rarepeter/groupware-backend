import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './interface/auth.interface';
import { constructResponseJson } from '../lib/respones';
import { InternalServerErrorHttpException } from '../api-http-exceptions/ApiHttpExceptions';
import { Response } from 'express';
import { AuthenticationGuard } from '../guards/auth/auth.guard';
import { RequestWithAuth } from '../guards/auth/request-with-auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  async signIn(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userFrontEndDto = await this.authService.signIn(authDto, response);

    if (userFrontEndDto === null) throw new InternalServerErrorHttpException();

    return constructResponseJson(userFrontEndDto);
  }

  @UseGuards(AuthenticationGuard)
  @Get('sign-out')
  async signOut(
    @Req() requestWithAuth: RequestWithAuth,
    @Res({ passthrough: true }) response: Response,
  ) {
    const {
      user: { userId },
    } = requestWithAuth;

    await this.authService.signOut(response, userId);

    return;
  }
}
