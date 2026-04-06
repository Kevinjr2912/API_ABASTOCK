import { Query } from '@nestjs/cqrs';
import { InventoryProductDto } from '../dtos/outputs/inventory-product.dto';

export class ListInventoryProductsQuery extends Query<InventoryProductDto[]> {
  constructor(public readonly storeId: string) {
    super();
  }
}