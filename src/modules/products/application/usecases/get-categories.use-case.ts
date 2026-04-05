import { ProductReadRepository } from "../ports/product-read.repository";

export class GetCategoriesUseCase {
  constructor (private readonly productReadRepository: ProductReadRepository){}

  async execute () {
    return await this.productReadRepository.getCategories();
  }
}