export class SaleItem {
  constructor(
    private readonly saleItemId: string,
    private readonly presentationId: string,
    private readonly quantity: number,
    private readonly salePrice: number,
    private readonly subtotal: number,
  ) {}

  getId(): string {
    return this.saleItemId;
  }

  getPresentationId(): string {
    return this.presentationId;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getSalePrice(): number {
    return this.salePrice;
  }

  getSubtotal(): number {
    return this.subtotal;
  }
}
