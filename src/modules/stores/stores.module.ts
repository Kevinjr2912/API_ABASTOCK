import { Module } from '@nestjs/common';
import { StoreController } from './infraestructure/controllers/store.controller';
import { StoreReadRepositoryImpl } from './infraestructure/adapters/store-read.adapter';
import { StoreWriteRepositoryImpl } from './infraestructure/adapters/store-write.adapter';
import { CreateStoreCommandHandler } from './application/commands/handlers/create-store.handler';
import { CreateStoreUseCase } from './application/usecases/create-store.use-case';
import { StoreWriteRepository } from './domain/repositories/store-write.repository';
import { StoreReadRepository } from './application/ports/store-read.repository';

@Module({
  providers: [
    // handlers
    CreateStoreCommandHandler,

    // adapters
    { provide: 'StoreReadRepository',  useClass: StoreReadRepositoryImpl },
    { provide: 'StoreWriteRepository', useClass: StoreWriteRepositoryImpl },

    // Use Cases
    {
      provide: CreateStoreUseCase,
      useFactory: (
        storeWriteRepository: StoreWriteRepository,
        storeReadRepository: StoreReadRepository
      ) => new CreateStoreUseCase(storeWriteRepository, storeReadRepository),
      inject: ['StoreWriteRepository', 'StoreReadRepository']
    }

  ],
  controllers: [StoreController]
})
export class StoresModule {}
