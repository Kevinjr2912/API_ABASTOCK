import { Module } from '@nestjs/common';
import { UnitOfWorkPort } from 'src/core/common/transaction/application/unit-of-work.port';
import { CreateSaleCommandHandler } from './application/commands/handlers/create-sale.handler';
import { GetSalesByDateQueryHandler } from './application/queries/handlers/get-sales-by-date.handler';
import { CreateSaleUseCase } from './application/usecases/create-sale.use-case';
import { GetSalesByDateUseCase } from './application/usecases/get-sales-by-date.use-case';
import { SaleReadRepository } from './application/ports/sale-read.repository';
import { SaleWriteRepository } from './domain/repositories/sale-write.repository';
import { InventoryReadRepository } from '../inventories/application/ports/inventory-read.repository';
import { InventoryWriteRepository } from '../inventories/domain/repositories/inventory-write.repository';
import { SaleReadRepositoryImpl } from './infraestructure/adapters/sale-read.adapter';
import { SaleWriteRepositoryImpl } from './infraestructure/adapters/sale-write.adapter';
import { InventoryReadRepositoryImpl } from '../inventories/infraestructure/adapters/inventory-read.adapter';
import { InventoryWriteRepositoryImpl } from '../inventories/infraestructure/adapters/inventory-write.adapter';
import { SaleController } from './infraestructure/controllers/sale.controller';

@Module({
  providers: [
    // CQRS Handlers
    CreateSaleCommandHandler,
    GetSalesByDateQueryHandler,

    // Adapters / Repositories
    { provide: 'SaleReadRepository', useClass: SaleReadRepositoryImpl },
    { provide: 'SaleWriteRepository', useClass: SaleWriteRepositoryImpl },
    { provide: 'InventoryReadRepository', useClass: InventoryReadRepositoryImpl },
    { provide: 'InventoryWriteRepository', useClass: InventoryWriteRepositoryImpl },

    // Use Cases
    {
      provide: CreateSaleUseCase,
      useFactory: (
        unitOfWork: UnitOfWorkPort,
        saleWriteRepo: SaleWriteRepository,
        inventoryReadRepo: InventoryReadRepository,
        inventoryWriteRepo: InventoryWriteRepository,
      ) => new CreateSaleUseCase(unitOfWork, saleWriteRepo, inventoryReadRepo, inventoryWriteRepo),
      inject: [
        'UnitOfWorkPort',
        'SaleWriteRepository',
        'InventoryReadRepository',
        'InventoryWriteRepository'
      ]
    },
    {
      provide: GetSalesByDateUseCase,
      useFactory: (
        saleReadRepo: SaleReadRepository
      ) => new GetSalesByDateUseCase(saleReadRepo),
      inject: [
        'SaleReadRepository'
      ]
    }
  ],
  controllers: [SaleController]
})
export class SalesModule {}
