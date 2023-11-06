import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { VacationService } from './vacation.service';
import { RequestWithAuth } from '../guards/auth/request-with-auth.interface';
import { CreateVacationDto } from './dto/vacation.dto';
import { User } from '../user/interface/user.interface';
import { AuthenticationGuard } from '../guards/auth/auth.guard';
import { constructResponseJson } from '../lib/respones';
import { InternalServerErrorHttpException } from '../api-http-exceptions/ApiHttpExceptions';

@UseGuards(AuthenticationGuard)
@Controller('vacations')
export class VacationController {
  constructor(private vacationService: VacationService) {}

  @Get('user/:userId')
  async getUserVacations(
    @Param('userId') userId: User['userId'],
    @Req() requestWithAuth: RequestWithAuth,
  ) {
    const vacations = await this.vacationService.getUserVacations(userId);

    return constructResponseJson(vacations);
  }

  @Post('new')
  async createVacation(
    @Req() requestWithAuth: RequestWithAuth,
    @Body() createVacationDto: CreateVacationDto,
  ) {
    const {
      user: { userId },
    } = requestWithAuth;

    const createdVacation = await this.vacationService.createVacation(
      createVacationDto,
      userId,
    );

    if (createdVacation === null) throw new InternalServerErrorHttpException();

    return constructResponseJson(createdVacation);
  }

  @Delete('vacationId')
  async deleteVacation() {}
}
