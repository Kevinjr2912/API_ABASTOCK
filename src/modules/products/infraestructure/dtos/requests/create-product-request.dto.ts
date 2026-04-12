import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BarcodeDto {
  @ApiProperty({ description: 'ID exclusivo del código de barras', example: 'd3b07384-d9a2-4a00-843c-396b27d499ec' })
  @IsUUID()
  @IsNotEmpty()
  barcodeId!: string;

  @ApiProperty({ description: 'Código numérico/alfanumérico', example: '7501055310883' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  code!: string;

  @ApiProperty({ description: 'Estado general del código de barras', example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class PresentationDto {
  @ApiProperty({ description: 'ID UUID único de la presentacion', example: 'b1a2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6' })
  @IsUUID()
  @IsNotEmpty()
  presentationId!: string;

  @ApiProperty({ description: 'Valor dimensional o cantidad de la unidad', example: 600 })
  @IsNumber()
  @Min(0.01)
  value!: number;

  @ApiProperty({ description: 'Unidad de medida', example: 'ml' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  unit!: string;

  @ApiProperty({ description: 'Precio al público de esta presentación', example: 18.50 })
  @IsNumber()
  @IsPositive()
  salePrice!: number;

  @ApiProperty({ description: 'Información del código de barras', type: BarcodeDto })
  @ValidateNested()
  @Type(() => BarcodeDto)
  barcode!: BarcodeDto;
}

export class CreateProductRequestDto {
  @ApiProperty({ description: 'ID de la tienda', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @IsUUID()
  @IsNotEmpty()
  storeId!: string;

  @ApiProperty({ description: 'UUID base del producto general', example: 'a1111111-2222-3333-4444-555555555555' })
  @IsUUID()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty({ description: 'Nombre descriptivo del producto', example: 'Coca Cola Regular' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @ApiProperty({ description: 'ID de la marca en base de datos', example: 'bb222222-3333-4444-5555-666666666666' })
  @IsUUID()
  @IsNotEmpty()
  brandId!: string;

  @ApiProperty({ description: 'ID de la categoría en base de datos', example: 'cc333333-4444-5555-6666-777777777777' })
  @IsUUID()
  @IsNotEmpty()
  categoryId!: string;

  @ApiProperty({ description: 'Datos de la variante/presentación a dar de alta simultáneamente', type: PresentationDto })
  @ValidateNested()
  @Type(() => PresentationDto)
  presentation!: PresentationDto;
}