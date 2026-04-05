import { Module } from '@nestjs/common';
import { CloudinaryAdapter } from './infraestructure/adapters/cloudinary.adapter';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const uploadDir = join(process.cwd(), 'uploads');
if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });
const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: (_req, _file, cb) => cb(null, uploadDir),
        filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
      }),
      fileFilter: (_req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);  
        } else {
          cb(null, false); 
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  ],
  providers: [
    {
      provide: 'ImageStoragePort',
      useClass: CloudinaryAdapter
    },
  ],
  exports: ['ImageStoragePort', MulterModule],
})
export class StorageModule {}

