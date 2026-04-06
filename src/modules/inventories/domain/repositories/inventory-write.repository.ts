import { Inventory } from "../entities/inventory.entity";

export interface InventoryWriteRepository {
  save(inventory: Inventory): Promise<void>;
  update(inventory: Inventory): Promise<void>;
}
