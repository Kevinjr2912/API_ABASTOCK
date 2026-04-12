
import { ApplicationError } from 'src/core/errors/application-error';
import { INVENTORY_ERROR_CODES } from './codes/inventory-codes.error';

export class InventoryNotFoundError extends ApplicationError {
  code = INVENTORY_ERROR_CODES.INVENTORY_NOT_FOUND;

  constructor(presentationId: string) {
    super(`No inventory found for presentation ${presentationId}`);
  }
}
