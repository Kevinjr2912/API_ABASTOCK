import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateInventoryCommand } from "../create-inventory.command";
import { CreatedInventoryDto } from "../../dtos/outputs/created-inventory.dto";
import { CreateInventoryUseCase } from "../../usecases/create-inventory.use-case";

@CommandHandler(CreateInventoryCommand)
export class CreateInventoryCommandHandler implements ICommandHandler<CreateInventoryCommand, CreatedInventoryDto> {
  constructor (private readonly createInventoryUseCase: CreateInventoryUseCase) {}

  async execute(command: CreateInventoryCommand): Promise<CreatedInventoryDto> {
    return await this.createInventoryUseCase.execute({
      inventoryId: command.inventoryId,
      storeId: command.storeId,
      presentationId: command.presentationId,
    });
  }
}