export interface SaleItemInputDto {
  saleItemId: string;
  presentationId: string;
  inventoryId: string;
  quantity: number;
  salePrice: number;
  subtotal: number;
}

export interface CreateSaleDto {
  saleId: string;
  storeId: string;
  saleDate: Date;
  totalAmount: number;
  saleItems: SaleItemInputDto[];
}
