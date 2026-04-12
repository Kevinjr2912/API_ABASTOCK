import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs/promises';
import { ImageStoragePort } from '../../application/ports/image-storage.port';

@Injectable()
export class CloudinaryAdapter implements ImageStoragePort {
  async save(imagePath: string): Promise<string> {
    const result = await cloudinary.uploader.upload(imagePath);
    try {
      await fs.unlink(imagePath);
    } catch (err) {
      console.error(`Failed to delete local image at ${imagePath}:`, err);
    }
    return result.secure_url;
  }
}