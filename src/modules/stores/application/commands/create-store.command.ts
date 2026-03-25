import { Command } from "@nestjs/cqrs";

export class CreateStoreCommand extends Command <void> {
  constructor (
    public readonly storeId: string,
    public readonly userId: string,
    public readonly name: string
  ){
    super();
  }
}