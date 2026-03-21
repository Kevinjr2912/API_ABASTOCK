import { PostgreSQl } from 'src/core/database/PostgreSQL';
import { User } from '../domain/entities/User';
import { UserWriteRepository } from '../domain/repositories/user-write.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserWriteRepositoryImpl implements UserWriteRepository {
  constructor(private readonly conn: PostgreSQl) {}

  async save(user: User): Promise<void> {
    const sql = `
        INSERT INTO users (
            user_id,
            first_name,
            middle_name,
            first_surname,
            second_last_name,
            phone_number,
            email,
            password
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    const params = [
      user.getId(),
      user.getFirstName(),
      user.getMiddleName(),
      user.getFirstSurname(),
      user.getSecondLastName(),
      user.getPhoneNumber(),
      user.getEmail(),
      user.getPassword(),
    ];

    const result = await this.conn.query(sql, params);

    if (result.rowCount === 0) throw new Error('Error inserting user');
  }
}
