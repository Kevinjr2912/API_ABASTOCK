import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterTokenDto {
  @ApiProperty({ description: 'ID del usuario propietario/asociado', example: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6' })
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty({ 
    description: 'Token de registro de FCM obtenido desde el SDK de Google en el móvil',
    example: 'fcm_token_example_12345'
  })
  @IsString()
  @IsNotEmpty()
  token!: string;
}
