import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindProductByBarcodeQuery } from '../find-product-by-barcode.query';
import { FindProductByBarcodeUseCase } from '../../usecases/find-product-by-barcode.use-case';
import { InventoryProductDto } from '../../dtos/outputs/inventory-product.dto';

@QueryHandler(FindProductByBarcodeQuery)
export class FindProductByBarcodeQueryHandler implements IQueryHandler<FindProductByBarcodeQuery> {
  constructor(private readonly useCase: FindProductByBarcodeUseCase) {}

  async execute(query: FindProductByBarcodeQuery): Promise<InventoryProductDto | null> {
    return this.useCase.execute(query.storeId, query.barcode);
  }
}