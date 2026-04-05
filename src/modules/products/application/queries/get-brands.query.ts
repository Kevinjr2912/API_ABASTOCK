import { Query } from "@nestjs/cqrs";
import { BrandDto } from "../dtos/outputs/brand.dto";

export class GetBrandsQuery extends Query<BrandDto[]> {}