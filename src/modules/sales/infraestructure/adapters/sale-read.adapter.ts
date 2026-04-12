import { Injectable } from '@nestjs/common';
import { PostgreSQl } from "src/core/database/PostgreSQL";
import { SaleReadRepository } from '../../application/ports/sale-read.repository';
import { SalesListDto, SaleDetailDto } from '../../application/dtos/outputs/sales-list.dto';

@Injectable()
export class SaleReadRepositoryImpl implements SaleReadRepository {
  constructor(private readonly conn: PostgreSQl){}

  async getSalesByStoreAndDate(storeId: string, date: string): Promise<SalesListDto> {
    const sql = `
      SELECT 
        s.sale_id,
        s.sale_date,
        s.total_amount,
        si.quantity,
        si.subtotal,
        p.name AS product_name
      FROM sales s
      JOIN sale_items si ON s.sale_id = si.sale_id
      JOIN product_presentations pp ON si.presentation_id = pp.presentation_id
      JOIN products p ON pp.product_id = p.product_id
      WHERE s.store_id = $1 AND DATE(s.sale_date) = $2
      ORDER BY s.sale_date DESC
    `;
    
    const result = await this.conn.query(sql, [storeId, date]);
    
    const salesMap = new Map<string, any>();
    let totalRevenue = 0;
    
    for (const row of result.rows) {
      if (!salesMap.has(row.sale_id)) {
        salesMap.set(row.sale_id, {
          saleId: row.sale_id,
          saleDate: row.sale_date,
          totalAmount: parseFloat(row.total_amount),
          totalItems: 0,
          items: []
        });
        totalRevenue += parseFloat(row.total_amount);
      }
      
      const sale = salesMap.get(row.sale_id);
      const qty = parseFloat(row.quantity);
      sale.totalItems += qty;
      sale.items.push({
        productName: row.product_name,
        quantity: qty,
        subtotal: parseFloat(row.subtotal)
      });
    }
    
    const sales: SaleDetailDto[] = Array.from(salesMap.values()).map(s => {
      const timeStr = new Date(s.saleDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      return {
        saleId: s.saleId,
        time: timeStr,
        totalAmount: s.totalAmount,
        totalItems: s.totalItems,
        items: s.items
      };
    });
    
    return {
      summary: {
        totalRevenue,
        transactionCount: sales.length
      },
      sales
    };
  }
}
