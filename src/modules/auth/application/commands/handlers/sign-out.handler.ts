import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignOutCommand } from '../sign-out.command';
import { SignOutUseCase } from '../../usecases/sign-out.use-case';

@CommandHandler(SignOutCommand)
export class SignOutCommandHandler implements ICommandHandler<SignOutCommand> {
  constructor(private readonly signOutUseCase: SignOutUseCase) {}

  async execute(command: SignOutCommand): Promise<void> {
    return this.signOutUseCase.execute(command.sessionId);
  }
}