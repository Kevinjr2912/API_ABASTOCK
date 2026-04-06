import { PostgreSQl } from "src/core/database/PostgreSQL";
import { InventoryReadRepository } from "../../application/ports/inventory-read.repository";
import { InventoryProductDto } from "../../application/dtos/outputs/inventory-product.dto";

export class InventoryReadRepositoryImpl implements InventoryReadRepository {
  constructor(private readonly conn: PostgreSQl){}

  async findByBarcode(storeId: string,barcode: string): Promise<InventoryProductDto | null> {
    const sql = `
      SELECT 
        i.inventory_id,
        i.current_stock,
        p.name AS product_name,
        b.name AS brand_name,
        c.name AS category_name,
        pp.image_uri,
        pp.presentation_id,
        pp.value,
        pp.unit,
        pb.barcode
      FROM inventory i
      JOIN product_presentations pp ON pp.presentation_id = i.presentation_id
      JOIN products p ON p.product_id = pp.product_id
      JOIN brands b ON b.brand_id = p.brand_id
      JOIN categories c ON c.category_id = p.category_id
      JOIN product_barcodes pb ON pb.presentation_id = pp.presentation_id
      WHERE i.store_id = $1
        AND pb.barcode = $2
        AND pb.is_active = true
      LIMIT 1
    `;
    const result = await this.conn.query(sql, [storeId, barcode]);
    return result.rowCount ? result.rows[0] : null;
  }

  async findByStore(storeId: string): Promise<InventoryProductDto[]> {
    const sql = `
      SELECT DISTINCT ON (pp.presentation_id)
        i.inventory_id,
        i.current_stock,
        pp.presentation_id,
        p.name AS product_name,
        b.name AS brand_name,
        c.name AS category_name,
        pp.sale_price,
        pp.image_uri,
        pp.value,
        pp.unit,
        pb.barcode
      FROM inventory i
      JOIN product_presentations pp ON pp.presentation_id = i.presentation_id
      JOIN products p ON p.product_id = pp.product_id
      JOIN brands b ON b.brand_id = p.brand_id
      JOIN categories c ON c.category_id = p.category_id
      LEFT JOIN product_barcodes pb ON pb.presentation_id = pp.presentation_id AND pb.is_active = true
      WHERE i.store_id = $1
      ORDER BY pp.presentation_id, pb.barcode
    `;

    const result = await this.conn.query(sql, [storeId]);
    return result.rows;
  }

  async findInventoryByStoreAndPresentation(storeId: string, presentationId: string): Promise<{inventoryId: string, currentStock: number, minStockAlert: number} | null> {

    const sql = `
      SELECT inventory_id, current_stock, min_stock_alert
      FROM inventory
      WHERE store_id = $1 AND presentation_id = $2
      LIMIT 1
    `;

    const result = await this.conn.query(sql, [storeId, presentationId]);
    return result.rowCount ? result.rows[0] : null;
  }
}