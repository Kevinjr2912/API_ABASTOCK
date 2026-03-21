import { Command } from "@nestjs/cqrs";
import { User } from "src/modules/users/domain/entities/User";

export class SignInCommand extends Command<{ access_token: string, refresh_token: string }> {
  constructor(public readonly user: User) {
    super();
  }
}