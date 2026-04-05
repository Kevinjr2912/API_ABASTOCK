import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetBrandsQuery } from "../get-brands.query";
import { BrandDto } from "../../dtos/outputs/brand.dto";
import { GetBrandsUseCase } from "../../usecases/get-brands.use-case";

@QueryHandler(GetBrandsQuery)
export class GetBrandsQueryHandler implements IQueryHandler<GetBrandsQuery> {
  constructor (private readonly getBrandsUseCase: GetBrandsUseCase) {}

  async execute(): Promise<BrandDto[]> {
    return this.getBrandsUseCase.execute();
  }
}