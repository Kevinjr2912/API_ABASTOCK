import { SalesListDto } from '../dtos/outputs/sales-list.dto';

export interface SaleReadRepository {
  getSalesByStoreAndDate(storeId: string, date: string): Promise<SalesListDto>;
}
