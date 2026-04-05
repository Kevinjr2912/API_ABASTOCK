import { Injectable } from '@nestjs/common';
import { UserReadRepository } from '../application/ports/user-read.repository';
import { User } from '../domain/entities/User';
import { PostgreSQl } from '../../../core/database/PostgreSQL';

@Injectable()
export class UserReadRepositoryImpl implements UserReadRepository {
  constructor(private readonly conn: PostgreSQl) {}

  async existsByEmail(email: string): Promise<boolean> {
    const sql = 'SELECT EXISTS (SELECT 1 FROM users WHERE email = $1)';
    const result = await this.conn.query(sql, [email]);
    return result.rows[0].exists;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findByField('email', email);
  }

  private async findByField(field: 'email' | 'phone_number', value: string): Promise<User | null> {
    const sql = `
      SELECT
        u.user_id,
        u.first_name,
        u.middle_name,
        u.first_surname,
        u.second_last_name,
        u.phone_number,
        u.email,
        u.password
      FROM users u
      WHERE u.${field} = $1
      LIMIT 1
    `;

    const result = await this.conn.query(sql, [value]);

    if (result.rows.length === 0) return null;

    const row = result.rows[0];

    return new User(
      row.user_id,
      row.first_name,
      row.middle_name,
      row.first_surname,
      row.second_last_name,
      row.phone_number,
      row.email,
      row.password,
    );
  }
}
