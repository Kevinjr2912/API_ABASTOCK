import { Product } from "../../domain/entities/product.entity";

export interface ProductReadRepository {
  findByNameBrandCategory(name: string, brandId: string, categoryId: string): Promise<Product | null>;
  //getCategories(): Promise<CategoryDto[]>;
  //getBrands(): Promise<BrandDto[]>;
}