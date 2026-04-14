import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterDeviceTokenCommand } from '../register-device-token.command';
import { RegisterDeviceTokenUseCase } from '../../usecases/register-device-token.usecase';

@CommandHandler(RegisterDeviceTokenCommand)
export class RegisterDeviceTokenCommandHandler implements ICommandHandler<RegisterDeviceTokenCommand> {
  constructor(private readonly useCase: RegisterDeviceTokenUseCase) {}

  async execute(command: RegisterDeviceTokenCommand): Promise<void> {
    await this.useCase.execute(command.userId, command.token);
  }
}
