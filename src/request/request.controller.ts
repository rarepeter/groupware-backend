import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { RequestService } from './request.service';
import {
  CreateContactUsRequestDto,
  CreateUserRequestDto,
} from './dto/request.dto';
import { constructResponseJson } from '../lib/respones';
import { RequestWithAuth } from '../guards/auth/request-with-auth.interface';
import { AuthenticationGuard } from '../guards/auth/auth.guard';
import {
  InternalServerErrorHttpException,
  NotEnoughPermissionsHttpException,
} from '../api-http-exceptions/ApiHttpExceptions';

@Controller('requests')
export class RequestController {
  constructor(private requestService: RequestService) {}

  @Post('contact-us/new')
  async createContactUsRequest(
    @Body() createContactUsRequestDto: CreateContactUsRequestDto,
  ) {
    const createdContactUsRequest =
      await this.requestService.createContactUsRequest(
        createContactUsRequestDto,
      );

    return constructResponseJson(createdContactUsRequest);
  }

  @UseGuards(AuthenticationGuard)
  @Get('contact-us')
  async getContactUsRequests(@Req() requestWithAuth: RequestWithAuth) {
    const {
      user: { role },
    } = requestWithAuth;

    if (role !== 'admin') throw new NotEnoughPermissionsHttpException();

    const contactUsRequests = await this.requestService.getContactUsRequests();

    return constructResponseJson(contactUsRequests);
  }

  @UseGuards(AuthenticationGuard)
  @Post('new')
  async createRequest(
    @Req() requestWithAuth: RequestWithAuth,
    @Body() createRequestDto: CreateUserRequestDto,
  ) {
    const {
      user: { userId },
    } = requestWithAuth;

    const createdRequest = await this.requestService.createUserRequest(
      createRequestDto,
      userId,
    );

    if (createdRequest === null) throw new InternalServerErrorHttpException();

    constructResponseJson(createdRequest);
  }
}
