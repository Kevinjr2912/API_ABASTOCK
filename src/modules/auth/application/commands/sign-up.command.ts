import { Command } from '@nestjs/cqrs';

export class SignUpCommand extends Command<void> {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly middleName: string | null,
    public readonly firstSurname: string,
    public readonly secondLastName: string,
    public readonly phoneNumber: string,
    public readonly email: string,
    public readonly password: string,
  ) {
    super();
  }
}
