import { Injectable } from '@nestjs/common';
import { TransactionalRepository } from 'src/core/common/transaction/infraestructure/repositories/transactional.repository';
import { SaleWriteRepository } from '../../domain/repositories/sale-write.repository';
import { Sale } from '../../domain/entities/sale.entity';
import { PostgreSQl } from 'src/core/database/PostgreSQL';

@Injectable()
export class SaleWriteRepositoryImpl extends TransactionalRepository implements SaleWriteRepository {
  constructor(db: PostgreSQl) {
    super(db);
  }

  async createSale(sale: Sale): Promise<void> {
    const runner = this.getRunner();

    await runner.query(
      `INSERT INTO sales (sale_id, store_id, sale_date, total_amount)
       VALUES ($1, $2, $3, $4)`,
      [
        sale.getId(),
        sale.getStoreId(),
        sale.getSaleDate(),
        sale.getTotalAmount(),
      ],
    );

    const itemSql = `
      INSERT INTO sale_items 
        (sale_item_id, sale_id, presentation_id, quantity, sale_price, subtotal)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

    for (const item of sale.getSaleItems()) {
      await runner.query(itemSql, [
        item.getId(),
        sale.getId(),
        item.getPresentationId(),
        item.getQuantity(),
        item.getSalePrice(),
        item.getSubtotal(),
      ]);
    }
  }
}
