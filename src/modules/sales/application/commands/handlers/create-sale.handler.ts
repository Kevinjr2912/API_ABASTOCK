import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateSaleCommand } from '../create-sale.command';
import { CreateSaleUseCase } from '../../usecases/create-sale.use-case';

@CommandHandler(CreateSaleCommand)
export class CreateSaleCommandHandler implements ICommandHandler<CreateSaleCommand> {
  constructor(private readonly useCase: CreateSaleUseCase) {}

  async execute(command: CreateSaleCommand): Promise<void> {
    await this.useCase.execute(command.dto);
  }
}
