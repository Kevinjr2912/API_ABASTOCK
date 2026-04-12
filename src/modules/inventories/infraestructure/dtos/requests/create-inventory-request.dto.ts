import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInventoryRequestDto {
  @ApiProperty({ description: 'ID exclusivo del inventario', example: 'ed9e8dec-304f-4ddf-b625-77f08c6a485d' })
  @IsUUID()
  @IsNotEmpty()
  inventoryId!: string;

  @ApiProperty({ description: 'ID de la tienda', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @IsUUID()
  @IsNotEmpty()
  storeId!: string;

  @ApiProperty({ description: 'ID de la presentación a incluir', example: '1a2b3c4d-5e6f-7a8b-9c0d-e1f2a3b4c5d6' })
  @IsUUID()
  @IsNotEmpty()
  presentationId!: string;
}