import { Injectable } from '@nestjs/common';
import { PostgreSQl } from 'src/core/database/PostgreSQL';
import type { DeviceTokenRepository } from '../../application/ports/device-token.repository';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DeviceTokenAdapter implements DeviceTokenRepository {
  constructor(private readonly conn: PostgreSQl) {}

  async saveToken(userId: string, token: string): Promise<void> {
    const tokenId = uuidv4();
    const sql = `
      INSERT INTO user_device_tokens (token_id, user_id, fcm_token)
      VALUES ($1, $2, $3)
      ON CONFLICT (fcm_token) DO UPDATE SET user_id = $2
    `;
    await this.conn.query(sql, [tokenId, userId, token]);
  }

  async getTokensByUserId(userId: string): Promise<string[]> {
    const sql = `SELECT fcm_token FROM user_device_tokens WHERE user_id = $1`;
    const result = await this.conn.query(sql, [userId]);
    return result.rows.map(row => row.fcm_token);
  }

  async getAllActiveTokens(): Promise<{ userId: string; token: string }[]> {
    const sql = `
      SELECT DISTINCT ON (user_id) user_id, fcm_token 
      FROM user_device_tokens 
      ORDER BY user_id, created_at DESC
    `;
    const result = await this.conn.query(sql);
    return result.rows.map(row => ({
      userId: row.user_id,
      token: row.fcm_token
    }));
  }
}
