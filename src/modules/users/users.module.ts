import { Module } from '@nestjs/common';
import { UserWriteRepositoryImpl } from './adapters/user-write.adapter';
import { UserReadRepositoryImpl } from './adapters/user-read.adapter';

@Module({
  providers: [
    {
      provide: 'UserWriteRepository',
      useClass: UserWriteRepositoryImpl,
    },
    {
      provide: 'UserReadRepository',
      useClass: UserReadRepositoryImpl,
    },
  ],
  exports: ['UserWriteRepository', 'UserReadRepository'],
})
export class UsersModule {}
