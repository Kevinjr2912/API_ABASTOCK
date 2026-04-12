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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({ 
    schema: { 
      type: 'object', 
      properties: { 
        email: { type: 'string', example: 'juan.perez@example.com' }, 
        password: { type: 'string', example: 'Abcd!123' } 
      } 
    } 
  })
  @ApiResponse({ status: 200, description: 'Sesión iniciada correctamente, retorna el token JWT.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  @Post('sign-in')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  login(@Request() req) {
    return this.commandBus.execute(new SignInCommand(req.user));
  }

  @ApiOperation({ summary: 'Registro de nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Estructura o payload inválido.' })
  @ApiResponse({ status: 409, description: 'El correo electrónico ya está registrado.' })
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

  @ApiOperation({ summary: 'Refrescar token de sesión' })
  @ApiBody({ 
    schema: { 
      type: 'object', 
      properties: { 
        refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' } 
      } 
    } 
  })
  @ApiResponse({ status: 200, description: 'Token refrezcado exitosamente.' })
  @ApiResponse({ status: 401, description: 'Refresh token inválido o expirado.' })
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refreshToken') token: string) {
    return this.commandBus.execute(new RefreshTokenCommand(token));
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar sesión segura' })
  @ApiResponse({ status: 204, description: 'Sesión cerrada y eliminada para prevenir accesos.' })
  @ApiResponse({ status: 401, description: 'No autorizado / Token ausente o incorrecto.' })
  @Post('sign-out')
  @UseGuards(JwtAuthGuard) 
  @HttpCode(HttpStatus.NO_CONTENT)
  async signOut(@Request() req) {
    await this.commandBus.execute(new SignOutCommand(req.user.sessionId));
  }
}
