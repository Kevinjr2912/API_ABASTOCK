import { Barcode } from "../value-objects/bar-code.value-object";

export class ProductPresentation {
  private barcode: Barcode;

  constructor(
    private readonly presentationId: string,
    private readonly productId: string,
    private readonly imageUri: string,
    private readonly value: number,
    private readonly unit: string,
    private readonly salePrice: number,
    barcode: Barcode
  ) {
    this.barcode = barcode;
  }

  getId(): string              { return this.presentationId }
  getProductId(): string       { return this.productId }
  getImageUri(): string        { return this.imageUri }
  getValue(): number           { return this.value }
  getUnit(): string            { return this.unit }
  getSalePrice(): number       { return this.salePrice }
  getBarcode(): Barcode        { return this.barcode }

}