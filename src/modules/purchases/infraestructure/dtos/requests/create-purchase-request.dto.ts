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

class PurchaseItemRequestDto {
  @ApiProperty({ description: 'ID de la fila de la entrada (UUID)', example: 'a1111111-2222-3333-4444-555555555555' })
  @IsUUID()
  @IsNotEmpty()
  purchaseItemId!: string;

  @ApiProperty({ description: 'ID de la presentación que ingresa', example: 'bb222222-3333-4444-5555-666666666666' })
  @IsUUID()
  @IsNotEmpty()
  presentationId!: string;

  @ApiProperty({ description: 'ID del inventario al que se sumará', example: 'cc333333-4444-5555-6666-777777777777' })
  @IsUUID()
  @IsNotEmpty()
  inventoryId!: string;

  @ApiProperty({ description: 'Cantidad física comprada al proveedor', example: 100 })
  @IsNumber()
  @IsPositive()
  quantity!: number;

  @ApiProperty({ description: 'Precio de costo por unidad (cuánto le costó a la tienda)', example: 12.50 })
  @IsNumber()
  @Min(0)
  costPrice!: number;

  @ApiProperty({ description: 'Precio de venta final actualizado', example: 18.50 })
  @IsNumber()
  @Min(0)
  salePrice!: number;
}

export class CreatePurchaseRequestDto {
  @ApiProperty({ description: 'ID único del ticket de compra al proveedor', example: 'd4444444-5555-6666-7777-888888888888' })
  @IsUUID()
  @IsNotEmpty()
  purchaseId!: string;

  @ApiProperty({ description: 'ID de la tienda', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @IsUUID()
  @IsNotEmpty()
  storeId!: string;

  @ApiProperty({ description: 'Fecha en que se efectuó o recibió la compra', example: '2026-04-11T13:30:00Z' })
  @Type(() => Date)
  @IsDate()
  purchaseDate!: Date;

  @ApiProperty({ description: 'Suma de costos de la factura al proveedor', example: 1250.00 })
  @IsNumber()
  @Min(0)
  totalCost!: number;

  @ApiProperty({ description: 'Array con el detalle de artículos surtidos', type: [PurchaseItemRequestDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseItemRequestDto)
  purchaseItems!: PurchaseItemRequestDto[];
}