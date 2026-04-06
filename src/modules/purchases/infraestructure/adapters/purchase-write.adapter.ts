import { Injectable } from '@nestjs/common';
import { TransactionalRepository } from 'src/core/common/transaction/infraestructure/repositories/transactional.repository';
import { PurchaseWriteRepository } from '../../domain/repositories/purchase-write.repository';
import { Purchase } from '../../domain/entities/purchase.entity';
import { PostgreSQl } from 'src/core/database/PostgreSQL';

@Injectable()
export class PurchaseWriteRepositoryImpl extends TransactionalRepository implements PurchaseWriteRepository {
  constructor(db: PostgreSQl) {
    super(db);
  }

  async createPurchase(purchase: Purchase): Promise<void> {
    const runner = this.getRunner();

    await runner.query(
      `INSERT INTO purchases (purchase_id, store_id, purchase_date, total_cost)
       VALUES ($1, $2, $3, $4)`,
      [
        purchase.getId(),
        purchase.getStoreId(),
        purchase.getPurchaseDate(),
        purchase.getTotalCost(),
      ],
    );

    const itemSql = `
      INSERT INTO purchase_items 
        (purchase_item_id, purchase_id, presentation_id, quantity, cost_price)
      VALUES ($1, $2, $3, $4, $5)
    `;

    for (const item of purchase.getPurchaseItems()) {
      await runner.query(itemSql, [
        item.getId(),
        purchase.getId(),
        item.getPresentationId(),
        item.getQuantity(),
        item.getCostPrice(),
      ]);
    }
  }
}