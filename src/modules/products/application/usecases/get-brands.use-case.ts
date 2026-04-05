import { ProductReadRepository } from "../ports/product-read.repository";

export class GetBrandsUseCase {
  constructor (private readonly productReadRepository: ProductReadRepository) {}

  async execute() {
    return await this.productReadRepository.getBrands();
  }
}