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

export class BarcodeDto {
  @IsUUID()
  @IsNotEmpty()
  barcodeId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  code!: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class PresentationDto {
  @IsUUID()
  @IsNotEmpty()
  presentationId!: string;

  @IsNumber()
  @Min(0.01)
  value!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  unit!: string;

  @IsNumber()
  @IsPositive()
  salePrice!: number;

  @ValidateNested()
  @Type(() => BarcodeDto)
  barcode!: BarcodeDto;
}

export class CreateProductRequestDto {
  @IsUUID()
  @IsNotEmpty()
  storeId!: string;

  @IsUUID()
  @IsNotEmpty()
  productId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @IsUUID()
  @IsNotEmpty()
  brandId!: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId!: string;

  @ValidateNested()
  @Type(() => PresentationDto)
  presentation!: PresentationDto;
}