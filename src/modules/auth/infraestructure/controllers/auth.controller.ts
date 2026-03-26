import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { SignUpCommand } from '../../application/commands/sign-up.command';
import { SignUpRequestDto } from '../dtos/requests/SignUpRequest.dto';
import { SignInCommand } from '../../application/commands/sign-in.command';
import { RefreshTokenCommand } from '../../application/commands/refresh-token.command';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { SignOutCommand } from '../../application/commands/sign-out.command';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('sign-in')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  login(@Request() req) {
    return this.commandBus.execute(new SignInCommand(req.user));
  }

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() dto: SignUpRequestDto) {
    await this.commandBus.execute(
      new SignUpCommand(
        dto.id,
        dto.firstName,
        dto.middleName ?? null,
        dto.firstSurname,
        dto.secondLastName,
        dto.phoneNumber,
        dto.email,
        dto.password,
      ),
    );

    return { message: 'User created successfully' };
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refreshToken') token: string) {
    return this.commandBus.execute(new RefreshTokenCommand(token));
  }

  @Post('sign-out')
  @UseGuards(JwtAuthGuard) 
  @HttpCode(HttpStatus.NO_CONTENT)
  async signOut(@Request() req) {
    await this.commandBus.execute(new SignOutCommand(req.user.sessionId));
  }
}
