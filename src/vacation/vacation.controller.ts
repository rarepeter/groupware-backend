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

@UseGuards(AuthenticationGuard)
@Controller('vacations')
export class VacationController {
  constructor(private vacationService: VacationService) {}

  @Get('user/:userId')
  async getUserVacations(@Param('userId') userId: User['userId']) {}

  // @Post('new')
  // async createVacation(
  //   @Req() requestWithAuth: RequestWithAuth,
  //   @Body() createVacationDto: CreateVacationDto,
  // ) {
  //   const {
  //     user: { userId },
  //   } = requestWithAuth;

  //   const createdVacation = await this.vacationService.createVacation(
  //     createVacationDto,
  //     userId,
  //   );

  //   return constructResponseJson(createdVacation);
  // }

  @Delete('vacationId')
  async deleteVacation() {}
}
