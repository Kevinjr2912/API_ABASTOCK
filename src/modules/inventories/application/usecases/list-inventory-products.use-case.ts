import { InventoryReadRepository } from '../ports/inventory-read.repository';

export class ListInventoryProductsUseCase {
  constructor(private readonly inventoryReadRepository: InventoryReadRepository) {}

  async execute(storeId: string) {
    return this.inventoryReadRepository.findByStore(storeId);
  }
}