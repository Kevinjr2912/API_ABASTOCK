export class ProductBarCode {
  constructor(
    private readonly productBarcodeId: string,
    private readonly presentationId: string,
    private readonly barcode: string,
    private readonly isActive: boolean = true,
  ) {}

  getId(): string { return this.productBarcodeId }
  getPresentationId(): string { return this.presentationId }
  getBarcode(): string { return this.barcode }
  getIsActive(): boolean { return this.isActive }
  
}