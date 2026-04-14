import type { NotificationPort } from '../ports/notification.port';
import type { DeviceTokenRepository } from '../ports/device-token.repository';
import type { DailySalesRepository } from '../ports/daily-sales.repository';
import { DailySummaryReport, NotificationFailure } from '../dtos/outputs/daily-summary-report.dto';

export class SendDailySummaryUseCase {
  constructor(
    private readonly salesRepository: DailySalesRepository,
    private readonly tokenRepository: DeviceTokenRepository,
    private readonly notificationPort: NotificationPort,
  ) {}

  async execute(): Promise<DailySummaryReport> {
    const summaries = await this.salesRepository.getDailySummaryByStore();
    
    let successCount = 0;
    let failureCount = 0;
    const failures: NotificationFailure[] = [];

    for (const summary of summaries) {
      const tokens = await this.tokenRepository.getTokensByUserId(summary.userId);
      
      if (tokens.length === 0) continue;

      const revenue = summary.totalRevenue.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
      const topProduct = summary.topProduct || 'N/A';
      
      const title = `¡Día completado en ${summary.storeName}!`;
      const body = `Hoy vendiste ${revenue}. Tu producto estrella fue: ${topProduct}.`;

      for (const token of tokens) {
        try {
          await this.notificationPort.sendPushNotification(token, title, body, {
            type: 'DAILY_SUMMARY',
            storeName: summary.storeName,
            totalRevenue: summary.totalRevenue.toString()
          });
          successCount++;
        } catch (e) {
          failureCount++;
          failures.push({
            userId: summary.userId,
            storeName: summary.storeName,
            error: e instanceof Error ? e.message : String(e)
          });
        }
      }
    }

    return new DailySummaryReport(
      summaries.length,
      successCount,
      failureCount,
      failures
    );
  }
}
