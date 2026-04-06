import { Query } from "@nestjs/cqrs";
import { InventoryProductDto } from "../dtos/outputs/inventory-product.dto";

export class FindProductByBarcodeQuery extends Query<InventoryProductDto | null> {
  constructor(
    public readonly storeId: string,
    public readonly barcode: string,
  ) {
    super();
  }
}