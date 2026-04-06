import { Injectable } from '@nestjs/common';
import { PostgreSQl } from 'src/core/database/PostgreSQL';
import { UnitOfWorkPort } from '../../application/unit-of-work.port';
import { transactionContext } from '../contexts/transaction-context';

@Injectable()
export class UnitOfWorkAdapter implements UnitOfWorkPort {
  constructor(private readonly db: PostgreSQl) {}

  async execute<T>(work: () => Promise<T>): Promise<T> {
    const client = await this.db.getClient();
    try {
      await client.query('BEGIN');
      const result = await transactionContext.run(client, work);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}