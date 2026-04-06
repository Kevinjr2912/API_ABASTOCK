
import { Injectable } from '@nestjs/common';
import { PostgreSQl } from 'src/core/database/PostgreSQL';
import { TransactionalRepository } from 'src/core/common/transaction/infraestructure/repositories/transactional.repository';
import { InventoryWriteRepository } from '../../domain/repositories/inventory-write.repository';
import { Inventory } from '../../domain/entities/inventory.entity';


@Injectable()
export class InventoryWriteRepositoryImpl extends TransactionalRepository implements InventoryWriteRepository {
  constructor(db: PostgreSQl) {
    super(db);
  }

  async save(inventory: Inventory): Promise<void> {
    const runner = this.getRunner();
    await runner.query(
      `INSERT INTO inventories (inventory_id, store_id, presentation_id, current_stock)
       VALUES ($1, $2, $3, $4)`,
      [
        inventory.getId(),
        inventory.getStoreId(),
        inventory.getPresentationId(),
        inventory.getCurrentStock()
      ],
    );
  }

  async update(inventory: Inventory): Promise<void> {
    const runner = this.getRunner();
    await runner.query(
      `
      UPDATE inventory
      SET current_stock = current_stock + $1
      WHERE inventory_id = $2
      `,
      [
        inventory.getCurrentStock(),
        inventory.getId()
      ],
    );
  }
}