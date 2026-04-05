import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateStoreRequestDto {
  @IsUUID()
  @IsNotEmpty()
  storeId!: string;

  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  name!: string;
}