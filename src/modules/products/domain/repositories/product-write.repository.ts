import { ProductPresentation } from "../entities/product-presentation.entity";
import { Product } from "../entities/product.entity";

export interface ProductWriteRepository {
  save(product: Product): Promise<void>;
  addPresentation(presentation: ProductPresentation): Promise<void>;
  updateSalePrice(presentationId: string, salePrice: number): Promise<void>;
}