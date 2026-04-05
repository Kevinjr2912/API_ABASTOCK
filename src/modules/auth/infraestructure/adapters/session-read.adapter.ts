import { Injectable } from '@nestjs/common';
import { SessionReadRepository } from '../../application/ports/session-read.repository';
import { UserSession } from '../../domain/entities/user-session.entity';
import { PostgreSQl } from '../../../../core/database/PostgreSQL';

@Injectable()
export class SessionReadRepositoryImpl implements SessionReadRepository {
  constructor(private readonly conn: PostgreSQl) {}

  async findById(sessionId: string): Promise<UserSession | null> {
    const sql = `
      SELECT 
        session_id, 
        user_id, 
        refresh_token, 
        is_revoked, 
        expires_at
      FROM user_sessions
      WHERE session_id = $1
    `;

    const result = await this.conn.query(sql, [sessionId]);

    if (result.rowCount === 0) return null;

    const row = result.rows[0];

    return new UserSession(
      row.session_id,
      row.user_id,
      row.refresh_token,
      row.is_revoked,
      row.expires_at,
    );
  }
}