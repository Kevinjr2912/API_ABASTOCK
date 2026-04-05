import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignUpCommand } from '../sign-up.command';
import { SignUpUseCase } from '../../usecases/sign-up.use-case';

@CommandHandler(SignUpCommand)
export class SignUpCommandHandler implements ICommandHandler<SignUpCommand> {
  constructor(
    private readonly signUpUseCase: SignUpUseCase
  ) {}

  async execute(command: SignUpCommand): Promise<void> {
    await this.signUpUseCase.execute({
      id: command.id,
      firstName: command.firstName,
      middleName: command.middleName,
      firstSurname: command.firstSurname,
      secondLastName: command.secondLastName,
      phoneNumber: command.phoneNumber,
      email: command.email,
      password: command.password,
    });
  }
}
