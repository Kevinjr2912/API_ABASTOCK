import { Injectable } from '@nestjs/common';
import { StoreWriteRepository } from '../../domain/repositories/store-write.repository';
import { Store } from '../../domain/entities/Store';
import { PostgreSQl } from '../../../../core/database/PostgreSQL';
import { TransactionalRepository } from 'src/core/common/transaction/infraestructure/repositories/transactional.repository';

@Injectable()
export class StoreWriteRepositoryImpl extends TransactionalRepository implements StoreWriteRepository {

  constructor(db: PostgreSQl) {
    super(db);
  }

  async save(store: Store): Promise<void> {
    const runner = this.getRunner();
    const sql = `
      INSERT INTO stores (
        store_id,
        user_id,
        name
      )
      VALUES ($1, $2, $3)
    `;

    const params = [store.getId(), store.getUserId(), store.getName()];
    const result = await runner.query(sql, params);
    if (result.rowCount === 0) throw new Error('Error inserting store');
  }
}
