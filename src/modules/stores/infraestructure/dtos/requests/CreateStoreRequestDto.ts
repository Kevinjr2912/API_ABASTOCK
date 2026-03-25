import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { CreateStoreDto } from "src/modules/stores/application/dtos/inputs/create-store.dto";

export class CreateStoreRequestDto implements CreateStoreDto {

  @IsUUID()
  @IsNotEmpty()
  storeId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  name: string;
  
}