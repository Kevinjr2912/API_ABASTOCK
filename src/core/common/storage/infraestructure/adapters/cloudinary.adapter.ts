import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { ImageStoragePort } from '../../application/ports/image-storage.port';

@Injectable()
export class CloudinaryAdapter implements ImageStoragePort {
  async save(imagePath: string): Promise<string> {
    const result = await cloudinary.uploader.upload(imagePath);
    await fs.promises.unlink(imagePath).catch(console.error);
    return result.secure_url;
  }
}