import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetCategoriesQuery } from "../get-categories.query";
import { GetCategoriesUseCase } from "../../usecases/get-categories.use-case";
import { CategoryDto } from "../../dtos/outputs/category.dto";

@QueryHandler(GetCategoriesQuery)
export class GetCategoriesQueryHandler implements IQueryHandler<GetCategoriesQuery> {
  constructor (private readonly getCategoriesUseCase: GetCategoriesUseCase) {}

  async execute(): Promise<CategoryDto[]> {
    return this.getCategoriesUseCase.execute();
  }
}