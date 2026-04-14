import { Injectable } from '@nestjs/common';
import { PostgreSQl } from 'src/core/database/PostgreSQL';
import type { DailySalesRepository, DailySalesSummary } from '../../application/ports/daily-sales.repository';

@Injectable()
export class DailySalesAdapter implements DailySalesRepository {
  constructor(private readonly conn: PostgreSQl) {}

  async getDailySummaryByStore(): Promise<DailySalesSummary[]> {
    const sql = `
      WITH DailySales AS (
        SELECT 
          st.user_id,
          st.store_id,
          st.name as store_name,
          SUM(s.total_amount) as total_revenue,
          COUNT(s.sale_id) as trans_count
        FROM stores st
        INNER JOIN sales s ON st.store_id = s.store_id
        WHERE DATE(s.sale_date) = CURRENT_DATE
        GROUP BY st.user_id, st.store_id, st.name
      ),
      TopProduct AS (
        SELECT 
          st.store_id,
          p.name as product_name,
          SUM(si.quantity) as total_qty,
          ROW_NUMBER() OVER(PARTITION BY st.store_id ORDER BY SUM(si.quantity) DESC) as rank
        FROM stores st
        INNER JOIN sales s ON st.store_id = s.store_id
        INNER JOIN sale_items si ON s.sale_id = si.sale_id
        INNER JOIN product_presentations pp ON si.presentation_id = pp.presentation_id
        INNER JOIN products p ON pp.product_id = p.product_id
        WHERE DATE(s.sale_date) = CURRENT_DATE
        GROUP BY st.store_id, p.name
      )
      SELECT 
        ds.user_id,
        ds.store_name,
        ds.total_revenue,
        ds.trans_count,
        tp.product_name as top_product
      FROM DailySales ds
      LEFT JOIN TopProduct tp ON ds.store_id = tp.store_id AND tp.rank = 1
    `;

    const result = await this.conn.query(sql);
    return result.rows.map(row => ({
      userId: row.user_id,
      storeName: row.store_name,
      totalRevenue: parseFloat(row.total_revenue),
      transCount: parseInt(row.trans_count),
      topProduct: row.top_product
    }));
  }
}
