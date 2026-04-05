import { PostgreSQl } from '../../../../core/database/PostgreSQL';
import { ProductPresentation } from '../../domain/entities/product-presentation.entity';
import { Product } from '../../domain/entities/product.entity';
import { ProductWriteRepository } from '../../domain/repositories/product-write.repository';
import { PoolClient } from 'pg';
import { Barcode } from '../../domain/value-objects/bar-code.value-object';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ProductWriteRepositoryImpl implements ProductWriteRepository {
  constructor(private readonly conn: PostgreSQl) {}

  async save(product: Product): Promise<void> {
    const client = await this.conn.getClient();
    try {
      await client.query('BEGIN');
      await this.insertProduct(client, product);
      await this.insertPresentation(client, product.getPresentations()[0]);
      await this.insertBarCode(
        client,
        product.getPresentations()[0].getId(),
        product.getPresentations()[0].getBarcode(),
      );
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async addPresentation(presentation: ProductPresentation): Promise<void> {
    const client = await this.conn.getClient();
    try {
      await client.query('BEGIN');
      await this.insertPresentation(client, presentation);
      await this.insertBarCode(
        client,
        presentation.getId(),
        presentation.getBarcode(),
      );
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  private async insertProduct(
    client: PoolClient,
    product: Product,
  ): Promise<void> {
    const sql = `
      INSERT INTO products (product_id, category_id, brand_id, name)
      VALUES ($1, $2, $3, $4)
    `;
    await client.query(sql, [
      product.getId(),
      product.getCategoryId(),
      product.getBrandId(),
      product.getName(),
    ]);
  }

  private async insertPresentation(
    client: PoolClient,
    presentation: ProductPresentation,
  ): Promise<void> {
    const presentationSql = `
      INSERT INTO product_presentations 
        (presentation_id, product_id, image_uri, value, unit, sale_price)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    await client.query(presentationSql, [
      presentation.getId(),
      presentation.getProductId(),
      presentation.getImageUri(),
      presentation.getValue(),
      presentation.getUnit(),
      presentation.getSalePrice(),
    ]);
  }

  private async insertBarCode(
    client: PoolClient,
    presentationId: string,
    barCode: Barcode,
  ): Promise<void> {
    const sql = `
      INSERT INTO product_barcodes 
        (product_barcode_id, presentation_id, barcode, is_active)
      VALUES ($1, $2, $3, $4)
    `;

    await client.query(sql, [
      barCode.getId(),
      presentationId,
      barCode.getCode(),
      barCode.isEnabled(),
    ]);
  }

  updateSalePrice(presentationId: string, salePrice: number): Promise<void> {
    return Promise.resolve();
  }
}
