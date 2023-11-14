import { Body, Controller, Post } from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateContactUsRequestDto } from './dto/request.dto';
import { constructResponseJson } from '../lib/respones';

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
}
