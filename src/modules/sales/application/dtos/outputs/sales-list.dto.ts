export interface SaleSummaryDto {
  totalRevenue: number;
  transactionCount: number;
}

export interface SaleItemDto {
  productName: string;
  quantity: number;
  subtotal: number;
}

export interface SaleDetailDto {
  saleId: string;
  time: string;
  totalAmount: number;
  totalItems: number;
  items: SaleItemDto[];
}

export interface SalesListDto {
  summary: SaleSummaryDto;
  sales: SaleDetailDto[];
}
