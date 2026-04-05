import { Injectable } from '@nestjs/common';
import { SessionWriteRepository } from '../../domain/repositories/session-write.repository';
import { UserSession } from '../../domain/entities/user-session.entity';
import { PostgreSQl } from '../../../../core/database/PostgreSQL';

@Injectable()
export class SessionWriteRepositoryImpl implements SessionWriteRepository {
  constructor(private readonly conn: PostgreSQl) {}

  async save(session: UserSession): Promise<void> {
    const sql = `
      INSERT INTO user_sessions (
        session_id, 
        user_id, 
        refresh_token, 
        is_revoked, 
        expires_at
      )
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (session_id) DO UPDATE SET
        refresh_token = EXCLUDED.refresh_token,
        is_revoked    = EXCLUDED.is_revoked
    `;

    const params = [
      session.getId(),
      session.getUserId(),
      session.getRefreshToken(),
      session.isRevoked(),
      session.getExpiresAt(),
    ];

    const result = await this.conn.query(sql, params);
    if (result.rowCount === 0) throw new Error('Error saving user session');
  }
  
}
