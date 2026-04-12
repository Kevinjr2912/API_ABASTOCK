import { InventoryWriteRepository } from '../../domain/repositories/inventory-write.repository';
import { InventoryReadRepository } from '../ports/inventory-read.repository';
import { CreateInventoryDto } from '../dtos/inputs/create-inventory.dto';
import { CreatedInventoryDto } from '../dtos/outputs/created-inventory.dto';
import { Inventory } from '../../domain/entities/inventory.entity';
import { InventoryAlreadyExistsError } from '../errors/inventory-already-exists.error';

export class CreateInventoryUseCase {
  constructor(
    private readonly inventoryWriteRepository: InventoryWriteRepository,
    private readonly inventoryReadRepository: InventoryReadRepository,
  ) {}

  async execute(dto: CreateInventoryDto): Promise<CreatedInventoryDto> {
    const existing = await this.inventoryReadRepository.findInventoryByStoreAndPresentation(
      dto.storeId, 
      dto.presentationId
    );

    if (existing) {
      throw new InventoryAlreadyExistsError(dto.storeId, dto.presentationId);
    }

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