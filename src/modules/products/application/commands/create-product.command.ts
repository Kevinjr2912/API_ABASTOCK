import { Command } from '@nestjs/cqrs';

export class CreateProductCommand extends Command<void> {
  constructor(
    public readonly storeId: string,
    public readonly productId: string,
    public readonly name: string,
    public readonly brandId: string,
    public readonly categoryId: string,
    public readonly presentation: {
      presentationId: string;
      imagePath: string,
      value: number;
      unit: string;
      salePrice: number;
      barcode: {
        barcodeId: string;
        code: string;
        isActive?: boolean;
      };
    }
  ) {
    super();
  }
}