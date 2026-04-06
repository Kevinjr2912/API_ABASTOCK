import { PostgreSQl } from '../../../../core/database/PostgreSQL';
import { ProductPresentation } from '../../domain/entities/product-presentation.entity';
import { Product } from '../../domain/entities/product.entity';
import { ProductWriteRepository } from '../../domain/repositories/product-write.repository';
import { PoolClient } from 'pg';
import { Barcode } from '../../domain/value-objects/bar-code.value-object';
import { Injectable } from '@nestjs/common';
import { TransactionalRepository } from 'src/core/common/transaction/infraestructure/repositories/transactional.repository';

@Injectable()
export class ProductWriteRepositoryImpl
  extends TransactionalRepository
  implements ProductWriteRepository
{
  constructor(db: PostgreSQl) {
    super(db);
  }

  async save(product: Product): Promise<void> {
    const runner = this.getRunner();
    try {
      await runner.query('BEGIN');

      await this.insertProduct(runner, product);
      await this.insertPresentation(runner, product.getPresentations()[0]);
      await this.insertBarCode(
        runner,
        product.getPresentations()[0].getId(),
        product.getPresentations()[0].getBarcode(),
      );

      await runner.query('COMMIT');
    } catch (err) {
      await runner.query('ROLLBACK');
      throw err;
    }
  }

  async addPresentation(presentation: ProductPresentation): Promise<void> {
    const runner = this.getRunner();
    await this.insertPresentation(runner, presentation);
    await this.insertBarCode(
      runner,
      presentation.getId(),
      presentation.getBarcode(),
    );
  }

  async updateSalePrice(
    presentationId: string,
    salePrice: number,
  ): Promise<void> {
    const runner = this.getRunner();
    await runner.query(
      `UPDATE product_presentations SET sale_price = $2 WHERE presentation_id = $1`,
      [presentationId, salePrice],
    );
  }

  private async insertProduct(runner: any, product: Product): Promise<void> {
    await runner.query(
      `INSERT INTO products (product_id, category_id, brand_id, name)
       VALUES ($1, $2, $3, $4)`,
      [
        product.getId(),
        product.getCategoryId(),
        product.getBrandId(),
        product.getName(),
      ],
    );
  }

  private async insertPresentation(
    runner: any,
    presentation: ProductPresentation,
  ): Promise<void> {
    await runner.query(
      `INSERT INTO product_presentations (presentation_id, product_id, image_uri, value, unit, sale_price)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        presentation.getId(),
        presentation.getProductId(),
        presentation.getImageUri(),
        presentation.getValue(),
        presentation.getUnit(),
        presentation.getSalePrice(),
      ],
    );
  }

  private async insertBarCode(
    runner: any,
    presentationId: string,
    barCode: Barcode,
  ): Promise<void> {
    await runner.query(
      `INSERT INTO product_barcodes (product_barcode_id, presentation_id, barcode, is_active)
       VALUES ($1, $2, $3, $4)`,
      [barCode.getId(), presentationId, barCode.getCode(), barCode.isEnabled()],
    );
  }
}
