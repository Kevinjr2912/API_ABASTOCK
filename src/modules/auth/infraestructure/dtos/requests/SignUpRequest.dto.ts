import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, Matches, IsUUID, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpRequestDto {
    @ApiProperty({ description: 'ID de registro del usuario (UUID)', example: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6' })
    @IsUUID()
    @IsNotEmpty()
    id!: string;

    @ApiProperty({ description: 'Primer nombre', example: 'Juan' })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    firstName!: string;

    @ApiProperty({ description: 'Segundo nombre (opcional)', example: 'Carlos', required: false })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    middleName?: string;

    @ApiProperty({ description: 'Primer apellido', example: 'Pérez' })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    firstSurname!: string;

    @ApiProperty({ description: 'Segundo apellido', example: 'López' })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    secondLastName!: string;

    @ApiProperty({ description: 'Número telefónico a 10 dígitos', example: '5512345678' })
    @IsString()
    @IsNotEmpty()
    @Matches(/^\+?[1-9]\d{9}$/, { message: 'Phone number must be 10 digits' })
    phoneNumber!: string;

    @ApiProperty({ description: 'Correo electrónico válido', example: 'juan.perez@example.com' })
    @IsEmail()
    @IsNotEmpty()
    @Transform(({ value }) => value?.toLowerCase().trim())
    email!: string;

    @ApiProperty({ description: 'Contraseña (min 8 exactos, con mayúscula, minúscula, número y símbolo)', example: 'Abcd!123' })
    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(8, { message: 'Password must not exceed 8 characters' })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
        { message: 'Password must include uppercase, lowercase, numbers and special characters' }
    )
    password!: string;
}