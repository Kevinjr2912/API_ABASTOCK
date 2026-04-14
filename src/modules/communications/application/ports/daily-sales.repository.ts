export interface DailySalesSummary {
  userId: string;
  storeName: string;
  totalRevenue: number;
  transCount: number;
  topProduct: string | null;
}

export interface DailySalesRepository {
  getDailySummaryByStore(): Promise<DailySalesSummary[]>;
}
