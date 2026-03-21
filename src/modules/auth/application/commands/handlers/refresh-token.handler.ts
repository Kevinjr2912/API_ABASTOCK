import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokenCommand } from '../refresh-token.command';
import { RefreshTokenUseCase } from '../../usecases/refresh-token.use-case';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenCommandHandler implements ICommandHandler<RefreshTokenCommand> {
  constructor(private readonly refreshTokenUseCase: RefreshTokenUseCase) {}

  async execute(command: RefreshTokenCommand) {
    return this.refreshTokenUseCase.execute(command.refreshToken);
  }
}