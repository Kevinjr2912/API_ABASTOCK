import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateInventoryRequestDto {
  @IsUUID()
  @IsNotEmpty()
  inventoryId!: string;

  @IsUUID()
  @IsNotEmpty()
  storeId!: string;

  @IsUUID()
  @IsNotEmpty()
  presentationId!: string;
}