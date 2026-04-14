import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RegisterDeviceTokenCommandHandler } from './application/commands/handlers/register-device-token.handler';
import { TriggerDailySummaryCommandHandler } from './application/commands/handlers/trigger-daily-summary.handler';
import { RegisterDeviceTokenUseCase } from './application/usecases/register-device-token.usecase';
import { SendDailySummaryUseCase } from './application/usecases/send-daily-summary.usecase';
import { DailySummaryJob } from './infraestructure/jobs/daily-summary.job';
import { DeviceTokenController } from './infraestructure/controllers/device-token.controller';
import { FCMAdapter } from './infraestructure/adapters/fcm.adapter';
import { DeviceTokenAdapter } from './infraestructure/adapters/device-token.adapter';
import { DailySalesAdapter } from './infraestructure/adapters/daily-sales.adapter';
import { DeviceTokenRepository } from './application/ports/device-token.repository';
import { DailySalesRepository } from './application/ports/daily-sales.repository';
import { NotificationPort } from './application/ports/notification.port';

@Module({
  imports: [CqrsModule],
  controllers: [DeviceTokenController],
  providers: [
    // CQRS Handlers
    RegisterDeviceTokenCommandHandler,
    TriggerDailySummaryCommandHandler,

    // Jobs
    DailySummaryJob,

    // Adapters
    {
      provide: 'NotificationPort',
      useClass: FCMAdapter,
    },
    {
      provide: 'DeviceTokenRepository',
      useClass: DeviceTokenAdapter,
    },
    {
      provide: 'DailySalesRepository',
      useClass: DailySalesAdapter,
    },

    // Use Cases
    {
      provide: RegisterDeviceTokenUseCase,
      useFactory: (repository: DeviceTokenRepository) => 
        new RegisterDeviceTokenUseCase(repository),
      inject: ['DeviceTokenRepository'],
    },
    {
      provide: SendDailySummaryUseCase,
      useFactory: (
        salesRepo: DailySalesRepository,
        tokenRepo: DeviceTokenRepository,
        notifPort: NotificationPort,
      ) => new SendDailySummaryUseCase(salesRepo, tokenRepo, notifPort),
      inject: ['DailySalesRepository', 'DeviceTokenRepository', 'NotificationPort'],
    },
  ],
  exports: [
    RegisterDeviceTokenUseCase,
    SendDailySummaryUseCase,
  ],
})
export class CommunicationsModule {}
