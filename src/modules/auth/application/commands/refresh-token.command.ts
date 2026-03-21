import { Command } from '@nestjs/cqrs';

export class RefreshTokenCommand extends Command<{
  access_token: string;
  refresh_token: string;
}> {
  constructor(public readonly refreshToken: string) {
    super();
  }
}