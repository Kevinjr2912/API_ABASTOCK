import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListInventoryProductsQuery } from '../list-inventory-products.query';
import { ListInventoryProductsUseCase } from '../../usecases/list-inventory-products.use-case';
import { InventoryProductDto } from '../../dtos/outputs/inventory-product.dto';

@QueryHandler(ListInventoryProductsQuery)
export class ListInventoryProductsQueryHandler implements IQueryHandler<ListInventoryProductsQuery> {
  constructor(private readonly useCase: ListInventoryProductsUseCase) {}

  async execute(query: ListInventoryProductsQuery): Promise<InventoryProductDto[]> {
    return this.useCase.execute(query.storeId);
  }
}