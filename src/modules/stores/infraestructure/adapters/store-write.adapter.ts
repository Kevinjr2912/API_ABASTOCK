import { Injectable } from '@nestjs/common';
import { StoreWriteRepository } from '../../domain/repositories/store-write.repository';
import { Store } from '../../domain/entities/Store';
import { PostgreSQl } from 'src/core/database/PostgreSQL';

@Injectable()
export class StoreWriteRepositoryImpl implements StoreWriteRepository {

  constructor (private readonly conn: PostgreSQl){}

  async save(store: Store): Promise<void> {
    const sql = `
      INSERT INTO stores (
        store_id,
        user_id,
        name
      )
      VALUES ($1, $2, $3)
    `;

    const params = [store.getId(), store.getUserId(), store.getName()];
    const result = await this.conn.query(sql, params);
    if (result.rowCount === 0) throw new Error('Error inserting store');
  }
}
