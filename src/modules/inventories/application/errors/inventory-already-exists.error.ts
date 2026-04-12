import { ApplicationError } from "../../../../core/errors/application-error";
import { INVENTORY_ERROR_CODES } from "./codes/inventory-codes.error";

export class InventoryAlreadyExistsError extends ApplicationError {
  code = INVENTORY_ERROR_CODES.INVENTORY_ALREADY_EXISTS;

  constructor(storeId: string, presentationId: string) {
    super(`Inventory for store ${storeId} and presentation ${presentationId} already exists`);
  }
}
