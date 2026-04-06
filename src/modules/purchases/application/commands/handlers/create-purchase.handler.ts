import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePurchaseCommand } from '../create-purchase.command';
import { CreatePurchaseUseCase } from '../../usecases/create-purchase.use-case';

@CommandHandler(CreatePurchaseCommand)
export class CreatePurchaseCommandHandler implements ICommandHandler<CreatePurchaseCommand> {
  constructor(private readonly createPurchaseUseCase: CreatePurchaseUseCase) {}

  async execute(command: CreatePurchaseCommand): Promise<void> {
    await this.createPurchaseUseCase.execute(command.dto);
  }
}