
import { ApplicationError } from 'src/core/errors/application-error';
import { SALES_ERROR_CODES } from './codes/sales-codes.error';

export class InsufficientStockError extends ApplicationError {
  code = SALES_ERROR_CODES.INSUFFICIENT_STOCK;

  constructor(productName: string) {
    super(`Insufficient stock for product: ${productName}. Cannot complete sale.`);
  }
}
