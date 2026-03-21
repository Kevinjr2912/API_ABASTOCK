import { Command } from '@nestjs/cqrs';

export class SignOutCommand extends Command<void> {
  constructor(public readonly sessionId: string) {
    super();
  }
}