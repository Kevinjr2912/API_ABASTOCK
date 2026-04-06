import { InventoryProductDto } from "../dtos/outputs/inventory-product.dto";

export interface InventoryReadRepository {
  findByBarcode(storeId: string, barcode: string): Promise<InventoryProductDto | null>;
  findByStore(storeId: string): Promise<InventoryProductDto[]>;
  findInventoryByStoreAndPresentation(storeId: string, presentationId: string): Promise<{inventoryId: string, currentStock: number, minStockAlert: number} | null>;
}