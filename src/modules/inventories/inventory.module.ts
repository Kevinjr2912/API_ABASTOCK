import { Module } from '@nestjs/common';
import { CreateInventoryCommandHandler } from './application/commands/handlers/create-inventory.handler';
import { InventoryWriteRepositoryImpl } from './infraestructure/adapters/inventory-write.adapter';
import { CreateInventoryUseCase } from './application/usecases/create-inventory.use-case';
import { InventoryWriteRepository } from './domain/repositories/inventory-write.repository';
import { InventoryController } from './infraestructure/controllers/inventory.controller';
import { FindProductByBarcodeQueryHandler } from './application/queries/handlers/find-product-by-barcode.handler';
import { ListInventoryProductsQueryHandler } from './application/queries/handlers/list-inventory-products.handler';
import { InventoryReadRepositoryImpl } from './infraestructure/adapters/inventory-read.adapter';
import { FindProductByBarcodeUseCase } from './application/usecases/find-product-by-barcode.use-case';
import { InventoryReadRepository } from './application/ports/inventory-read.repository';
import { ListInventoryProductsUseCase } from './application/usecases/list-inventory-products.use-case';

@Module({
  providers: [
    // handlers
    CreateInventoryCommandHandler,
    FindProductByBarcodeQueryHandler,
    ListInventoryProductsQueryHandler,

    // adapters
    {
      provide: 'InventoryWriteRepository',
      useClass: InventoryWriteRepositoryImpl,
    },
    {
      provide: 'InventoryReadRepository',
      useClass: InventoryReadRepositoryImpl,
    },

    // use cases
    {
      provide: CreateInventoryUseCase,
      useFactory: (inventoryWriteRepository: InventoryWriteRepository, inventoryReadRepository: InventoryReadRepository) =>
        new CreateInventoryUseCase(inventoryWriteRepository, inventoryReadRepository),
      inject: ['InventoryWriteRepository', 'InventoryReadRepository'],
    },
    {
      provide: FindProductByBarcodeUseCase,
      useFactory: (repo: InventoryReadRepository) =>
        new FindProductByBarcodeUseCase(repo),
      inject: ['InventoryReadRepository'],
    },
    {
      provide: ListInventoryProductsUseCase,
      useFactory: (repo: InventoryReadRepository) =>
        new ListInventoryProductsUseCase(repo),
      inject: ['InventoryReadRepository'],
    },
  ],
  controllers: [InventoryController],
})
export class InventoriesModule {}
