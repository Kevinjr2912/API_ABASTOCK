import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateProductRequestDto } from '../dtos/requests/create-product-request.dto';
import { CreateProductCommand } from '../../application/commands/create-product.command';
import { GetCategoriesQuery } from '../../application/queries/get-categories.query';
import { JwtAuthGuard } from 'src/modules/auth/infraestructure/guards/jwt-auth.guard';
import { GetBrandsQuery } from '../../application/queries/get-brands.query';

@Controller('products')
export class ProductController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Get('/categories')
  async getCategories() {
    return this.queryBus.execute(new GetCategoriesQuery());
  }

  @UseGuards(JwtAuthGuard)
  @Get('/brands')
  async getBrands() {
    return this.queryBus.execute(new GetBrandsQuery());
  }
}
