import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { AuthGuard } from 'nest-keycloak-connect';
import { ObjectId } from 'mongoose';
import { extname } from 'path';

@Controller('file')
@UseGuards(AuthGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('/multiple')
  getMultipleFiles(@Query('ids') ids: string): Promise<any> {
    return this.fileService.findMultipleByIds(ids);
  }

  @Get('/:id')
  getFile(@Param('id') id: ObjectId): Promise<any> {
    return this.fileService.findById(id);
  }

  @Delete('/delete/:id')
  deleteFile(@Param('id') id: ObjectId): Promise<any> {
    return this.fileService.deleteFileById(id);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        if (
          ext !== '.png' &&
          ext !== '.jpg' &&
          ext !== '.jpeg' &&
          ext !== '.pdf'
        ) {
          return cb(
            new Error(
              'Only images (.png, .jpg, .jpeg) and .pdf files are allowed!',
            ),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 1024 * 1024 * 10 },
    }),
  )
  async uploadFile(
    @UploadedFile() file,
    @Query('fieldId') fieldId: ObjectId,
    @Query('assetId') assetId: ObjectId,
  ) {
    return this.fileService.fileUpload({
      ...file,
      fieldId,
      assetId,
    });
  }
}
