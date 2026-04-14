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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  /* @ApiBearerAuth() */
  @ApiOperation({ summary: 'Crear un producto con su presentación e imagen' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de imagen del producto (JPEG/PNG/WEBP)',
        },
        data: {
          type: 'string',
          description: 'Stringificado de CreateProductRequestDto (e.g. {"storeId":"...","name":"...","presentation":{...}})'
        }
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Producto guardado en BD e imagen en Cloudinary.' })
  @ApiResponse({ status: 400, description: 'Estructura o imagen ausente / payload inválido.' })
  /* @UseGuards(JwtAuthGuard) */
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

      return await this.commandBus.execute(
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
    } catch (error) {
      const fs = await import('fs/promises');
      await fs.unlink(file.path).catch(() => {});
      throw error;
    }
  }

  /* @ApiBearerAuth() */
  @ApiOperation({ summary: 'Listar catálogo root de categorías' })
  @ApiResponse({ status: 200, description: 'Retorna array de categorias disponibles.' })
  /* @UseGuards(JwtAuthGuard) */
  @Get('/categories')
  async getCategories() {
    return this.queryBus.execute(new GetCategoriesQuery());
  }

  /* @ApiBearerAuth() */
  @ApiOperation({ summary: 'Listar catálogo root de marcas' })
  @ApiResponse({ status: 200, description: 'Retorna array de marcas disponibles.' })
  /* @UseGuards(JwtAuthGuard) */
  @Get('/brands')
  async getBrands() {
    return this.queryBus.execute(new GetBrandsQuery());
  }
}
