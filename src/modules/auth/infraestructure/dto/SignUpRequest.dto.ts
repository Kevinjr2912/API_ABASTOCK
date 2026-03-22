import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, Matches, IsUUID, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { SignUpDto } from '../../application/dtos/input/SignUp.dto';

export class SignUpRequestDto implements SignUpDto {
    @IsUUID()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    firstName: string;

    @IsString()
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    middleName?: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    firstSurname: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    secondLastName: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^\+?[1-9]\d{9}$/, { message: 'Phone number must be 10 digits' })
    phoneNumber: string;

    @IsEmail()
    @IsNotEmpty()
    @Transform(({ value }) => value?.toLowerCase().trim())
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(8, { message: 'Password must not exceed 8 characters' })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
        { message: 'Password must include uppercase, lowercase, numbers and special characters' }
    )
    password: string;
}