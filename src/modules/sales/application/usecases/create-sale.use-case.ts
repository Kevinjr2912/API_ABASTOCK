import { UnitOfWorkPort } from 'src/core/common/transaction/application/unit-of-work.port';
import { SaleWriteRepository } from '../../domain/repositories/sale-write.repository';
import { InventoryReadRepository } from 'src/modules/inventories/application/ports/inventory-read.repository';
import { InventoryWriteRepository } from 'src/modules/inventories/domain/repositories/inventory-write.repository';
import { CreateSaleDto } from '../dtos/inputs/create-sale.dto';
import { Sale } from '../../domain/entities/sale.entity';
import { SaleItem } from '../../domain/entities/sale-item.entity';
import { Inventory } from 'src/modules/inventories/domain/entities/inventory.entity';
import { InsufficientStockError } from '../../domain/errors/insufficient-stock.error';
import { InventoryNotFoundError } from 'src/modules/inventories/application/errors/inventory-not-found.error';

export class CreateSaleUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWorkPort,
    private readonly saleWriteRepository: SaleWriteRepository,
    private readonly inventoryReadRepository: InventoryReadRepository,
    private readonly inventoryWriteRepository: InventoryWriteRepository,
  ) {}

  async execute(dto: CreateSaleDto): Promise<void> {
    const sale = this.buildSale(dto);

    // Verificar Stock
    for (const item of sale.getSaleItems()) {
      const inventory = await this.inventoryReadRepository.findInventoryByStoreAndPresentation(
        dto.storeId,
        item.getPresentationId()
      );

      if (!inventory) {
        throw new InventoryNotFoundError(item.getPresentationId());
      }

      if (inventory.currentStock < item.getQuantity()) {
        throw new InsufficientStockError(item.getPresentationId());
      }
    }

    await this.unitOfWork.execute(async () => {
      await this.saleWriteRepository.createSale(sale);

      // Descontar inventario por cada item
      for (const item of dto.saleItems) {
        await this.inventoryWriteRepository.update(
          new Inventory(
            item.inventoryId,
            dto.storeId,
            item.presentationId,
            -item.quantity 
          )
        );
      }
    });
  }

  private buildSale(dto: CreateSaleDto): Sale {
    const sale = new Sale(
      dto.saleId,
      dto.storeId,
      dto.saleDate,
      dto.totalAmount,
    );

    for (const item of dto.saleItems) {
      sale.addSaleItem(
        new SaleItem(
          item.saleItemId,
          item.presentationId,
          item.quantity,
          item.salePrice,
          item.subtotal,
        ),
      );
    }

    return sale;
  }
}
