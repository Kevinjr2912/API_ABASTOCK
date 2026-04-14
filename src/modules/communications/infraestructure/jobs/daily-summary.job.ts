import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CommandBus } from '@nestjs/cqrs';
import { TriggerDailySummaryCommand } from '../../application/commands/trigger-daily-summary.command';
import { DailySummaryReport } from '../../application/dtos/outputs/daily-summary-report.dto';

@Injectable()
export class DailySummaryJob {
  private readonly logger = new Logger(DailySummaryJob.name);

  constructor(
    private readonly commandBus: CommandBus,
  ) {}

  @Cron('59 23 * * *') 
  async handleDailySummary() {
    this.logger.log('Starting scheduled daily summary job via CommandBus...');
    try {
      const report: DailySummaryReport = await this.commandBus.execute(new TriggerDailySummaryCommand());
      
      this.logger.log(`Scheduled job finished. Success: ${report.successCount}, Failures: ${report.failureCount}`);
      
      if (report.failureCount > 0) {
        report.failures.forEach(f => {
          this.logger.warn(`Failed to send notification to user ${f.userId} (Store: ${f.storeName}). Error: ${f.error}`);
        });
      }
    } catch (error) {
      this.logger.error('Error in scheduled DailySummaryJob trigger', error.stack);
    }
  }

  // Helper for manual testing
  async triggerManually(): Promise<DailySummaryReport> {
    return this.commandBus.execute(new TriggerDailySummaryCommand());
  }
}
