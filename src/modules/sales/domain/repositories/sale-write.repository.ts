import { Sale } from '../entities/sale.entity';

export interface SaleWriteRepository {
  createSale(sale: Sale): Promise<void>;
}
