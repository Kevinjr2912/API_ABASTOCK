import { Product } from "../../domain/entities/product.entity";
import { BrandDto } from "../dtos/outputs/brand.dto";
import { CategoryDto } from "../dtos/outputs/category.dto";

export interface ProductReadRepository {
  findByNameBrandCategory(name: string, brandId: string, categoryId: string): Promise<Product | null>;
  getCategories(): Promise<CategoryDto[]>;
  getBrands(): Promise<BrandDto[]>;
}