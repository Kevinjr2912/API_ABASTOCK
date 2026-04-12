import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSalesByDateQuery } from '../get-sales-by-date.query';
import { GetSalesByDateUseCase } from '../../usecases/get-sales-by-date.use-case';


@QueryHandler(GetSalesByDateQuery)
export class GetSalesByDateQueryHandler implements IQueryHandler<GetSalesByDateQuery> {
  constructor(private readonly useCase: GetSalesByDateUseCase) {}

  async execute(query: GetSalesByDateQuery) {
    return this.useCase.execute(query.storeId, query.date);
  }
}
