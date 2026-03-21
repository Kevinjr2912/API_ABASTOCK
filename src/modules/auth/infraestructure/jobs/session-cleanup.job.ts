import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PostgreSQl } from 'src/core/database/PostgreSQL';

@Injectable()
export class SessionCleanupJob {
  private readonly logger = new Logger(SessionCleanupJob.name);

  constructor(private readonly conn: PostgreSQl) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async execute() {
    this.logger.log('Running session cleanup job...');

    const sql = `
      DELETE FROM user_sessions
      WHERE expires_at < NOW()
    `;

    const result = await this.conn.query(sql);
    this.logger.log(`Deleted ${result.rowCount} expired sessions`);
  }
}