import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateProductRequestDto } from '../dtos/requests/create-product-request.dto';
import { CreateProductCommand } from '../../application/commands/create-product.command';

@Controller('products')
export class ProductController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.CREATED)
  async createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body('data') rawData: string,
  ) {
    if (!file) throw new BadRequestException('Image is required');
    if (!rawData) throw new BadRequestException('data field is required');

    let dto: CreateProductRequestDto;
    try {
      const parsed = JSON.parse(rawData);
      dto = plainToInstance(CreateProductRequestDto, parsed, {
        enableImplicitConversion: true,
      });
    } catch {
      throw new BadRequestException('Invalid JSON in data field');
    }

    const errors = await validate(dto);
    if (errors.length > 0) throw new BadRequestException(errors);

    await this.commandBus.execute(
      new CreateProductCommand(
        dto.storeId,
        dto.productId,
        dto.name,
        dto.brandId,
        dto.categoryId,
        {
          presentationId: dto.presentation.presentationId,
          imagePath: file.path,
          value: dto.presentation.value,
          unit: dto.presentation.unit,
          salePrice: dto.presentation.salePrice,
          barcode: {
            barcodeId: dto.presentation.barcode.barcodeId,
            code: dto.presentation.barcode.code,
            isActive: dto.presentation.barcode.isActive,
          },
        },
      ),
    );

    return { message: 'Product created successfully' };
  }
}
