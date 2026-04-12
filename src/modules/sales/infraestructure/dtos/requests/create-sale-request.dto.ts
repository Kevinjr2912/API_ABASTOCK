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
import { ApiProperty } from '@nestjs/swagger';

class SaleItemRequestDto {
  @ApiProperty({ description: 'ID de la fila de la venta', example: '3f17d7be-3546-4dd4-b44d-45a73485e294' })
  @IsUUID()
  @IsNotEmpty()
  saleItemId!: string;

  @ApiProperty({ description: 'ID de la presentación / producto vendido', example: '1a2b3c4d-5e6f-7a8b-9c0d-e1f2a3b4c5d6' })
  @IsUUID()
  @IsNotEmpty()
  presentationId!: string;

  @ApiProperty({ description: 'ID del inventario afectado', example: 'ed9e8dec-304f-4ddf-b625-77f08c6a485d' })
  @IsUUID()
  @IsNotEmpty()
  inventoryId!: string;

  @ApiProperty({ description: 'Cantidad vendida', example: 2 })
  @IsNumber()
  @IsPositive()
  quantity!: number;

  @ApiProperty({ description: 'Precio unitario en que se vendió', example: 45.50 })
  @IsNumber()
  @Min(0)
  salePrice!: number;

  @ApiProperty({ description: 'Subtotal del item (precio * cantidad)', example: 91.00 })
  @IsNumber()
  @Min(0)
  subtotal!: number;
}

export class CreateSaleRequestDto {
  @ApiProperty({ description: 'ID exclusivo de esta venta', example: 'e593cc62-e4e8-4464-8738-174936a5705b' })
  @IsUUID()
  @IsNotEmpty()
  saleId!: string;

  @ApiProperty({ description: 'Tienda en donde se realizó', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @IsUUID()
  @IsNotEmpty()
  storeId!: string;

  @ApiProperty({ description: 'Fecha y hora de la venta (ISO)', example: '2026-04-11T13:30:00Z' })
  @Type(() => Date)
  @IsDate()
  saleDate!: Date;

  @ApiProperty({ description: 'Suma de todos los subtotales', example: 91.00 })
  @IsNumber()
  @Min(0)
  totalAmount!: number;

  @ApiProperty({ description: 'Arreglo con los productos de esta venta', type: [SaleItemRequestDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItemRequestDto)
  saleItems!: SaleItemRequestDto[];
}
