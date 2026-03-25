import { Store } from "../../domain/entities/Store";
import { StoreWriteRepository } from "../../domain/repositories/store-write.repository";
import { CreateStoreDto } from "../dtos/inputs/create-store.dto";
import { ExistingStoreError } from "../errors/existing-store.error";
import { StoreReadRepository } from "../ports/store-read.repository";

export class CreateStoreUseCase {
  constructor(
    private readonly storeWriteRepository: StoreWriteRepository,
    private readonly storeReadRepository: StoreReadRepository
  ){}

  async execute ({ storeId, userId, name }: CreateStoreDto) {
    const storeExists = await this.storeReadRepository.existsByName(userId, name);
    if (storeExists) throw new ExistingStoreError();
    await this.storeWriteRepository.save( new Store(storeId, userId, name) );
  }
}