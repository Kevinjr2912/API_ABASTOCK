export class Barcode {
  constructor(
    private readonly barcodeId: string,
    private readonly code: string,
    private readonly isActive: boolean = true
  ) {}

  getId(): string    { return this.barcodeId }
  getCode(): string  { return this.code }
  isEnabled(): boolean { return this.isActive }
}