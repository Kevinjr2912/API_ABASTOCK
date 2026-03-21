import { Module, Global } from '@nestjs/common';
import { PostgreSQl } from './PostgreSQL';

@Global()
@Module({
  providers: [PostgreSQl],
  exports: [PostgreSQl],
})
export class DatabaseModule {}