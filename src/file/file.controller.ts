import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RequestWithAuth } from '../guards/auth/request-with-auth.interface';
import { constructResponseJson } from '../lib/respones';
import { FileService } from './file.service';
import { AuthenticationGuard } from '../guards/auth/auth.guard';
import { IFile } from './interface/file.interface';

@UseGuards(AuthenticationGuard)
@Controller('files')
export class FileController {
  constructor(private fileService: FileService) {}

  @Get('me')
  async getPersonalFiles(@Req() requestWithAuth: RequestWithAuth) {
    const {
      user: { filesIds },
    } = requestWithAuth;

    const files = await this.fileService.getFilesByIds(filesIds);

    return constructResponseJson(files);
  }

  @Post('me')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadPersonalFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() requestWithAuth: RequestWithAuth,
  ) {
    const {
      user: { userId },
    } = requestWithAuth;

    const filesResponse = await this.fileService.uploadPersonalFiles(
      files,
      userId,
    );

    if (filesResponse === null) throw new InternalServerErrorException();

    return constructResponseJson(filesResponse);
  }

  @Get('personal/:fileId')
  async downloadFile(
    @Param('fileId') fileId: IFile['fileId'],
    @Req() requestWithAuth: RequestWithAuth,
  ) {
    const fileData = await this.fileService.getFileFrontEndDto(fileId);

    if (fileData === null) throw new InternalServerErrorException();

    return constructResponseJson(fileData);
  }
}
