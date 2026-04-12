import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreRequestDto {
  @ApiProperty({ description: 'ID de la nueva tienda', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @IsUUID()
  @IsNotEmpty()
  storeId!: string;

  @ApiProperty({ description: 'ID del usuario propietario/asociado', example: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6' })
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty({ description: 'Nombre comercial de la tienda', example: 'Abarrotes Don Pepe' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  name!: string;
}