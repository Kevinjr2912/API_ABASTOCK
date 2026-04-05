import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

export const CLOUDINARY = 'CLOUDINARY';

export const CloudinaryProvider: Provider = {
  provide: CLOUDINARY,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return cloudinary.config({
      cloud_name: configService.get<string>('CLOUDINARY.NAME'),
      api_key: configService.get<string>('CLOUDINARY.API_KEY'),
      api_secret: configService.get<string>('CLOUDINARY.API_SECRET'),
      secure: true,
    });
  },
};