import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [FileService],
  controllers: [FileController],
  imports: [AuthModule],
})
export class FileModule {}
