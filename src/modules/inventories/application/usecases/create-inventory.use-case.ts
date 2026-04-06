import { InventoryWriteRepository } from '../../domain/repositories/inventory-write.repository';
import { CreateInventoryDto } from '../dtos/inputs/create-inventory.dto';
import { CreatedInventoryDto } from '../dtos/outputs/created-inventory.dto';
import { Inventory } from '../../domain/entities/inventory.entity';

export class CreateInventoryUseCase {
  constructor(
    private readonly inventoryWriteRepository: InventoryWriteRepository,
  ) {}

  async execute(dto: CreateInventoryDto): Promise<CreatedInventoryDto> {
    const inventory = new Inventory(
      dto.inventoryId,
      dto.storeId,
      dto.presentationId,
      0
    );

    await this.inventoryWriteRepository.save(inventory);

    return {
      inventoryId: inventory.getId(),
      storeId: inventory.getStoreId(),
      presentationId: inventory.getPresentationId(),
      stock: inventory.getCurrentStock(),
    };
  }
}