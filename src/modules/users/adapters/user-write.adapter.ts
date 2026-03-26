import { PostgreSQl } from 'src/core/database/PostgreSQL';
import { User } from '../domain/entities/User';
import { UserWriteRepository } from '../domain/repositories/user-write.repository';
import { Injectable } from '@nestjs/common';
import { EmailAlreadyTakenError } from '../application/errors/email-already-taken.error';
import { ForeignKeyViolationError } from 'src/core/errors/foreign-key-violation.error';
import { NotNullViolationError } from 'src/core/errors/not-null-violation.error';

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

  // private handleDBError(error: any, email: string): never {
  //   switch (error.code) {
  //     case '23505':
  //       throw new EmailAlreadyTakenError(email);
  //     case '23502':
  //       throw new NotNullViolationError();
  //     default:
  //       throw error;
  //   }
  // }
}
