import {
  Body,
  Controller,
  Delete,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { unlink } from 'fs/promises';
import { mkdirSync } from 'fs';
import { tmpdir } from 'os';

function filenameGenerator(
  _req: unknown,
  file: Express.Multer.File,
  cb: (error: Error | null, filename: string) => void,
) {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const ext = extname(file.originalname);
  cb(null, `${uniqueSuffix}${ext}`);
}

const isDevelopment = process.env.NODE_ENV !== 'production';
const LOCAL_UPLOAD_DIR = join(process.cwd(), 'uploads');
const TMP_UPLOAD_DIR = join(tmpdir(), 'tailor-uploads');
const UPLOAD_DIR = isDevelopment ? LOCAL_UPLOAD_DIR : TMP_UPLOAD_DIR;

@Controller('upload')
export class UploadController {
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          try {
            mkdirSync(UPLOAD_DIR, { recursive: true });
            cb(null, UPLOAD_DIR);
          } catch (e) {
            cb(e as Error, UPLOAD_DIR);
          }
        },
        filename: filenameGenerator,
      }),
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return {
      filename: file.filename,
      path: isDevelopment
        ? `/uploads/${file.filename}`
        : `${UPLOAD_DIR}/${file.filename}`,
      originalName: file.originalname,
    };
  }

  @Delete('image')
  async deleteImage(@Body('filename') filename: string) {
    if (!filename) {
      return { success: false };
    }
    try {
      await unlink(join(UPLOAD_DIR, filename));
      return { success: true };
    } catch {
      return { success: false };
    }
  }
}

