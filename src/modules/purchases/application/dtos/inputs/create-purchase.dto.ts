export interface PurchaseItemDto {
    purchaseItemId: string;
    presentationId: string;
    inventoryId:    string;
    quantity:       number;
    costPrice:      number;
    salePrice:      number;
}

export interface CreatePurchaseDto {
  purchaseId: string;
  storeId: string;
  purchaseDate: Date;
  totalCost: number;
  purchaseItems: PurchaseItemDto[];
}
