import { Module } from '@nestjs/common';
import { CreatePurchaseCommandHandler } from './application/commands/handlers/create-purchase.handler';
import { CreatePurchaseUseCase } from './application/usecases/create-purchase.use-case';
import { PurchaseController } from './infraestructure/controllers/purchase.controller';
import { PurchaseWriteRepository } from './domain/repositories/purchase-write.repository';
import { ProductWriteRepository } from '../products/domain/repositories/product-write.repository';
import { InventoryWriteRepository } from '../inventories/domain/repositories/inventory-write.repository';
import { PurchaseWriteRepositoryImpl } from './infraestructure/adapters/purchase-write.adapter';
import { ProductWriteRepositoryImpl } from '../products/infraestructure/adapters/product-write.adapter';
import { InventoryWriteRepositoryImpl } from '../inventories/infraestructure/adapters/inventory-write.adapter';
import { UnitOfWorkPort } from 'src/core/common/transaction/application/unit-of-work.port';


@Module({
  providers: [
    // Command Handler
    CreatePurchaseCommandHandler,

    // Repositories
    { provide: 'PurchaseWriteRepository', useClass: PurchaseWriteRepositoryImpl },
    { provide: 'ProductWriteRepository', useClass: ProductWriteRepositoryImpl },
    { provide: 'InventoryWriteRepository', useClass: InventoryWriteRepositoryImpl },

    // Use Case
    {
      provide: CreatePurchaseUseCase,
      useFactory: (
        unitOfWork: UnitOfWorkPort,
        purchaseRepo: PurchaseWriteRepository,
        productRepo: ProductWriteRepository,
        inventoryRepo: InventoryWriteRepository,
      ) => new CreatePurchaseUseCase(
        unitOfWork,
        purchaseRepo,
        productRepo,
        inventoryRepo,
      ),
      inject: [
        'UnitOfWorkPort', 
        'PurchaseWriteRepository',
        'ProductWriteRepository',
        'InventoryWriteRepository',
      ],
    },
  ],
  controllers: [PurchaseController],
})
export class PurchasesModule {}