import { SaleItem } from './sale-item.entity';

export class Sale {
  private readonly items: SaleItem[] = [];

  constructor(
    private readonly saleId: string,
    private readonly storeId: string,
    private readonly saleDate: Date,
    private totalAmount: number,
  ) {}

  addSaleItem(item: SaleItem) {
    this.items.push(item);
  }

  getId(): string {
    return this.saleId;
  }

  getStoreId(): string {
    return this.storeId;
  }

  getSaleDate(): Date {
    return this.saleDate;
  }

  getTotalAmount(): number {
    return this.totalAmount;
  }

  getSaleItems(): SaleItem[] {
    return this.items;
  }
}
