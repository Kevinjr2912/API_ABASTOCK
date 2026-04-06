import { InventoryReadRepository } from "../ports/inventory-read.repository";

export class FindProductByBarcodeUseCase {
  constructor(private readonly inventoryReadRepository: InventoryReadRepository) {}

  async execute(storeId: string, barcode: string) {
    return this.inventoryReadRepository.findByBarcode(storeId, barcode);
  }
}