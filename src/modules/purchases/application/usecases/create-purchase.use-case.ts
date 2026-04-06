import { UnitOfWorkPort } from 'src/core/common/transaction/application/unit-of-work.port';
import { PurchaseWriteRepository } from '../../domain/repositories/purchase-write.repository';
import { ProductWriteRepository } from 'src/modules/products/domain/repositories/product-write.repository';
import { InventoryWriteRepository } from 'src/modules/inventories/domain/repositories/inventory-write.repository';
import { CreatePurchaseDto } from '../dtos/inputs/create-purchase.dto';
import { Purchase } from '../../domain/entities/purchase.entity';
import { PurchaseItem } from '../../domain/entities/purchase-item.entity';
import { Inventory } from 'src/modules/inventories/domain/entities/inventory.entity';

export class CreatePurchaseUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWorkPort,
    private readonly purchaseWriteRepository: PurchaseWriteRepository,
    private readonly productWriteRepository: ProductWriteRepository,
    private readonly inventoryWriteRepository: InventoryWriteRepository,
  ) {}

  async execute(dto: CreatePurchaseDto): Promise<void> {
    const purchase = this.buildPurchase(dto);

    await this.unitOfWork.execute(async () => {
      await this.purchaseWriteRepository.createPurchase(purchase);

      for (const item of purchase.getPurchaseItems()) {
        await this.inventoryWriteRepository.update(
          new Inventory (
            item.getInventoryId(),
            dto.storeId,
            item.getPresentationId(),
            item.getQuantity()
          )
        );

        await this.productWriteRepository.updateSalePrice(
          item.getPresentationId(),
          item.getSalePrice(),
        );
      }
    });
  }

  private buildPurchase(dto: CreatePurchaseDto): Purchase {
    const purchase = new Purchase(
      dto.purchaseId,
      dto.storeId,
      dto.purchaseDate,
      dto.totalCost,
    );

    for (const item of dto.purchaseItems) {
      purchase.addPurchaseItem(
        new PurchaseItem(
          item.purchaseItemId,
          item.presentationId,
          item.inventoryId,
          item.quantity,
          item.costPrice,
          item.salePrice,
        ),
      );
    }

    return purchase;
  }
}