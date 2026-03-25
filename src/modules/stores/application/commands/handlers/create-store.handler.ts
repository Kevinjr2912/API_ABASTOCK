import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateStoreCommand } from "../create-store.command";
import { CreateStoreUseCase } from "../../usecases/create-store.use-case";

@CommandHandler(CreateStoreCommand)
export class CreateStoreCommandHandler implements ICommandHandler<CreateStoreCommand, void> {

  constructor (private readonly createStoreUseCase: CreateStoreUseCase) {}

  async execute(command: CreateStoreCommand): Promise<void> {
    await this.createStoreUseCase.execute({
      storeId: command.storeId,
      userId: command.userId,
      name: command.name
    });
  }
}