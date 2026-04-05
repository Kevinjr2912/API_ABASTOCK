import { ExistingProductPresentationError } from '../errors/existing-product.error';
import { ProductPresentation } from './product-presentation.entity';

export class Product {
  private presentations: ProductPresentation[];

  constructor(
    private readonly productId: string,
    private readonly categoryId: string,
    private readonly brandId: string,
    private readonly name: string,
    presentations: ProductPresentation[] = []
  ) {
    this.presentations = presentations;
  }

  getId(): string                            { return this.productId }
  getCategoryId(): string                    { return this.categoryId }
  getBrandId(): string                       { return this.brandId }
  getName(): string                          { return this.name }
  getPresentations(): ProductPresentation[]  { return [...this.presentations] }

  ensureCanAddPresentation(value: number, unit: string): void {
    const alreadyExists = this.presentations.some(
      p => p.getValue() === value && p.getUnit() === unit
    );
    if (alreadyExists) throw new ExistingProductPresentationError();
  }

  addPresentation(presentation: ProductPresentation): void {
    this.presentations.push(presentation);
  }
}