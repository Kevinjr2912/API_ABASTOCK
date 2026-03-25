import { Injectable } from '@nestjs/common';
import { StoreReadRepository } from '../../application/ports/store-read.repository';
import { PostgreSQl } from 'src/core/database/PostgreSQL';

@Injectable()
export class StoreReadRepositoryImpl implements StoreReadRepository {

  constructor (private readonly conn: PostgreSQl){}

  async existsByName(userId: string, name: string): Promise<boolean> {
    const sql =
      'SELECT EXISTS (SELECT 1 FROM stores WHERE user_id = $1 AND name = $2)';
    const result = await this.conn.query(sql, [userId, name]);
    return result.rows[0].exists;
  }
}
