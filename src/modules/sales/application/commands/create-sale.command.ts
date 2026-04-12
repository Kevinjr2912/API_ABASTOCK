import { CreateSaleDto } from '../dtos/inputs/create-sale.dto';

export class CreateSaleCommand {
  constructor(public readonly dto: CreateSaleDto) {}
}
