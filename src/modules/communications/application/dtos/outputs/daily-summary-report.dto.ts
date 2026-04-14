export interface NotificationFailure {
  userId: string;
  storeName: string;
  error: string;
}

export class DailySummaryReport {
  constructor(
    public readonly totalProcessed: number,
    public readonly successCount: number,
    public readonly failureCount: number,
    public readonly failures: NotificationFailure[]
  ) {}
}
