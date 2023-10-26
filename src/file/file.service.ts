import { Injectable } from '@nestjs/common';
import { FileFrontEndDto, IFile } from './interface/file.interface';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { FirestoreService } from '../firestore/firestore.service';
import { ConfigService } from '@nestjs/config';
import { getCurrentTimeInSeconds } from '../lib/time';
import { User } from '../user/interface/user.interface';
import { readFile, writeFile } from 'fs/promises';

@Injectable()
export class FileService {
  baseFilesLocation = path.join(__dirname, '..', '..', 'files');
  uploadedFilesLocation = path.join(this.baseFilesLocation, 'uploaded');

  constructor(private db: FirestoreService) {
    if (!fs.existsSync(this.uploadedFilesLocation)) {
      fs.mkdirSync(this.uploadedFilesLocation, { recursive: true });
    }
  }

  async uploadPersonalFiles(
    files: Array<Express.Multer.File>,
    uploadedByUserId: User['userId'],
  ) {
    const currentTimeInSeconds = getCurrentTimeInSeconds();

    const filesDtos: Array<IFile & { file: Express.Multer.File }> = files.map(
      (file) => {
        return {
          file,
          fileId: uuidv4(),
          type: 'personal',
          extension: file.originalname.split('.').at(-1) as string,
          mimeType: file.mimetype,
          fileName: file.originalname,
          uploadedAtTimestamp: currentTimeInSeconds,
          uploadedByUserId,
        };
      },
    );

    const fileDbDtos: Array<IFile> = filesDtos.map((fileDto) => {
      return {
        extension: fileDto.extension,
        type: 'personal',
        fileId: fileDto.fileId,
        mimeType: fileDto.mimeType,
        fileName: fileDto.fileName,
        uploadedAtTimestamp: fileDto.uploadedAtTimestamp,
        uploadedByUserId: fileDto.uploadedByUserId,
      };
    });

    const createdFiles = await this.db.addPersonalFiles(fileDbDtos);

    if (createdFiles === null) return null;

    const writeFilePromises = filesDtos.map(async (fileDto) => {
      return await writeFile(
        path.join(
          this.uploadedFilesLocation,
          `${fileDto.fileId}.${fileDto.extension}`,
        ),
        fileDto.file.buffer,
      );
    });

    await Promise.allSettled(writeFilePromises);

    return createdFiles;
  }

  async getFileFrontEndDto(fileId: IFile['fileId']) {
    const uploadedFile = await this.db.getUploadedFile(fileId);

    if (uploadedFile === null) return null;

    const fileBase64 = await readFile(
      path.join(
        this.uploadedFilesLocation,
        `${uploadedFile.fileId}.${uploadedFile.extension}`,
      ),
      { encoding: 'base64' },
    );

    const fileFrontEndDto: FileFrontEndDto = {
      fileBase64Url: `data:${uploadedFile.mimeType};base64,${fileBase64}`,
      fileId,
      extension: uploadedFile.extension,
      mimeType: uploadedFile.mimeType,
      fileName: uploadedFile.fileName,
    };

    return fileFrontEndDto;
  }

  async getFilesByIds(fileIds: Array<IFile['fileId']>) {
    const files = await this.db.getFilesByIds(fileIds);

    return files;
  }
}
