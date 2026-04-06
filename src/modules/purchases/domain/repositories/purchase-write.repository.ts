import { Purchase } from "../entities/purchase.entity";

export interface PurchaseWriteRepository {
  createPurchase(purchase: Purchase): Promise<void>;
}