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

class PurchaseItemRequestDto {
  @IsUUID()
  @IsNotEmpty()
  purchaseItemId!: string;

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
  costPrice!: number;

  @IsNumber()
  @Min(0)
  salePrice!: number;
}

export class CreatePurchaseRequestDto {
  @IsUUID()
  @IsNotEmpty()
  purchaseId!: string;

  @IsUUID()
  @IsNotEmpty()
  storeId!: string;

  @Type(() => Date)
  @IsDate()
  purchaseDate!: Date;

  @IsNumber()
  @Min(0)
  totalCost!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseItemRequestDto)
  purchaseItems!: PurchaseItemRequestDto[];
}