import { Module, Global } from '@nestjs/common';
import { PostgreSQl } from './PostgreSQL';
import { UnitOfWorkAdapter } from '../common/transaction/infraestructure/adapters/unit-of-work.adapter';

@Global()
@Module({
  providers: [
    PostgreSQl,
    {
      provide: 'UnitOfWorkPort',
      useClass: UnitOfWorkAdapter,
    },
  ],
  exports: [PostgreSQl, 'UnitOfWorkPort'],
})
export class DatabaseModule {}