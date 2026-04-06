import { Command } from '@nestjs/cqrs';
import { CreatePurchaseDto } from '../dtos/inputs/create-purchase.dto';

export class CreatePurchaseCommand extends Command<void> {
  constructor(public readonly dto: CreatePurchaseDto) {
    super();
  }
}