import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'src/modules/auth/infraestructure/guards/jwt-auth.guard';
import { RegisterTokenDto } from '../dtos/requests/register-token.dto';
import { RegisterDeviceTokenCommand } from '../../application/commands/register-device-token.command';
import { TriggerDailySummaryCommand } from '../../application/commands/trigger-daily-summary.command';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DailySummaryJob } from '../jobs/daily-summary.job';

@ApiTags('Communications')
@Controller('auth/device-token')
export class DeviceTokenController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly summaryJob: DailySummaryJob,
  ) {}

  /* @ApiBearerAuth() */
  @ApiOperation({ summary: 'Registrar el token de Firebase del dispositivo' })
  @ApiResponse({ status: 201, description: 'Token registrado exitosamente' })
  /* @UseGuards(JwtAuthGuard) */
  @Post()
  async registerToken(@Body() dto: RegisterTokenDto) {
    await this.commandBus.execute(new RegisterDeviceTokenCommand(dto.userId, dto.token));
    return { message: 'Device token registered' };
  }

  @ApiOperation({ summary: 'Endpoint de prueba para disparar el resumen diario manualmente' })
  @Get('test-summary')
  async testSummary() {
    const report = await this.summaryJob.triggerManually();
    return { 
      message: 'Test summary job triggered successfully via CommandBus',
      report 
    };
  }
}
