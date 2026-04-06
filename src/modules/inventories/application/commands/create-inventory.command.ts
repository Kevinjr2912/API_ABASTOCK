import { Command } from "@nestjs/cqrs";
import { CreatedInventoryDto } from "../dtos/outputs/created-inventory.dto";

export class CreateInventoryCommand extends Command<CreatedInventoryDto> {
  constructor(
    public readonly inventoryId: string,
    public readonly storeId: string,
    public readonly presentationId: string
  ) {
    super();
  }
}