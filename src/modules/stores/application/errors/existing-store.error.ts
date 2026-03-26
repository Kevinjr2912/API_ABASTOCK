import { ApplicationError } from "src/core/errors/application-error";
import { STORES_ERROR_CODES } from "./codes/stores-codes.error";

export class ExistingStoreError extends ApplicationError {
  code = STORES_ERROR_CODES.EXISTING_STORE;

  constructor() {
    super('A store with this name already exists for this user');
  }
}