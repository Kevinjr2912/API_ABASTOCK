import { Query } from "@nestjs/cqrs";
import { CategoryDto } from "../dtos/outputs/category.dto";

export class GetCategoriesQuery extends Query<CategoryDto[]> {}