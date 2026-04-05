import { Injectable } from '@nestjs/common';
import { PostgreSQl } from '../../../../core/database/PostgreSQL';
import { ProductReadRepository } from '../../application/ports/product-read.repository';
import { ProductPresentation } from '../../domain/entities/product-presentation.entity';
import { Product } from '../../domain/entities/product.entity';
import { Barcode } from '../../domain/value-objects/bar-code.value-object';
import { CategoryDto } from '../../application/dtos/outputs/category.dto';
import { BrandDto } from '../../application/dtos/outputs/brand.dto';

@Injectable()
export class ProductReadRepositoryImpl implements ProductReadRepository {
  constructor(private readonly conn: PostgreSQl) {}

  async findByNameBrandCategory(
    name: string,
    brandId: string,
    categoryId: string,
  ): Promise<Product | null> {
    const sql = `
      SELECT
        p.product_id,
        p.category_id,
        p.brand_id,
        p.name,
        pp.presentation_id,
        pp.image_uri,
        pp.value,
        pp.unit,
        pp.sale_price,
        pb.product_barcode_id,
        pb.barcode,
        pb.is_active
      FROM products p
      JOIN product_presentations pp ON pp.product_id = p.product_id
      JOIN product_barcodes pb
            ON pb.presentation_id = pp.presentation_id
            AND pb.is_active = true
      WHERE p.name = $1
        AND p.brand_id = $2
        AND p.category_id = $3
    `;

    const result = await this.conn.query(sql, [name, brandId, categoryId]);

    if (result.rowCount === 0) return null;

    const firstRow = result.rows[0];

    const presentations: ProductPresentation[] = [];

    for (const row of result.rows) {
      if (!row.presentation_id) continue;

      const barcode = new Barcode(
        row.product_barcode_id,
        row.barcode,
        row.is_active,
      );

      presentations.push(
        new ProductPresentation(
          row.presentation_id,
          firstRow.product_id,
          row.image_uri,
          Number(row.value),
          row.unit,
          Number(row.sale_price),
          barcode,
        ),
      );
    }

    return new Product(
      firstRow.product_id,
      firstRow.category_id,
      firstRow.brand_id,
      firstRow.name,
      presentations,
    );
  }

  async getCategories(): Promise<CategoryDto[]> {
    const sql = `
      SELECT category_id, name
      FROM categories
      ORDER BY name
    `;

    const result = await this.conn.query(sql);

    return result.rows.map((row) => ({
      categoryId: row.category_id,
      name: row.name,
    }));
  }

  async getBrands(): Promise<BrandDto[]> {
    const sql = `
        SELECT brand_id, name
        FROM brands
        ORDER BY name
    `;

    const result = await this.conn.query(sql);

    return result.rows.map((row) => ({
      brandId: row.brand_id,
      name: row.name,
    }));
  }
}
