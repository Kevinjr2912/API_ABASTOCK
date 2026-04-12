import { SaleReadRepository } from '../ports/sale-read.repository';

export class GetSalesByDateUseCase {
  constructor(
    private readonly saleReadRepository: SaleReadRepository,
  ) {}

  async execute(storeId: string, date: string) {
    return this.saleReadRepository.getSalesByStoreAndDate(storeId, date);
  }
}
