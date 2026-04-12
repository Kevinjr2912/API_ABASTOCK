import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsUUID,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class SaleItemRequestDto {
  @IsUUID()
  @IsNotEmpty()
  saleItemId!: string;

  @IsUUID()
  @IsNotEmpty()
  presentationId!: string;

  @IsUUID()
  @IsNotEmpty()
  inventoryId!: string;

  @IsNumber()
  @IsPositive()
  quantity!: number;

  @IsNumber()
  @Min(0)
  salePrice!: number;

  @IsNumber()
  @Min(0)
  subtotal!: number;
}

export class CreateSaleRequestDto {
  @IsUUID()
  @IsNotEmpty()
  saleId!: string;

  @IsUUID()
  @IsNotEmpty()
  storeId!: string;

  @Type(() => Date)
  @IsDate()
  saleDate!: Date;

  @IsNumber()
  @Min(0)
  totalAmount!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItemRequestDto)
  saleItems!: SaleItemRequestDto[];
}
