import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TriggerDailySummaryCommand } from '../trigger-daily-summary.command';
import { SendDailySummaryUseCase } from '../../usecases/send-daily-summary.usecase';
import { DailySummaryReport } from '../../dtos/outputs/daily-summary-report.dto';

@CommandHandler(TriggerDailySummaryCommand)
export class TriggerDailySummaryCommandHandler implements ICommandHandler<TriggerDailySummaryCommand> {
  constructor(private readonly useCase: SendDailySummaryUseCase) {}

  async execute(_command: TriggerDailySummaryCommand): Promise<DailySummaryReport> {
    return await this.useCase.execute();
  }
}
