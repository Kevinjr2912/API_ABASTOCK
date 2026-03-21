import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SignInCommand } from "../sign-in.command";
import { SignInUseCase } from "../../usecases/sign-in.use-case";

@CommandHandler(SignInCommand)
export class SignInCommandHandler implements ICommandHandler<SignInCommand> {
  constructor(private readonly signInUseCase: SignInUseCase) {}

  async execute(command: SignInCommand) {
    return this.signInUseCase.execute({
      id: command.user.getId(),
      name: `${command.user.getFirstName()} ${command.user.getFirstSurname()}`,
      email: command.user.getEmail(),
    });
  }
}