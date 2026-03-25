import { ApplicationError } from "src/core/errors/application-error";
import { ERROR_CODES } from "src/core/errors/error-codes";

export class ExistingStoreError extends ApplicationError {
  code = ERROR_CODES.EXISTING_STORE;

  constructor() {
    super('A store with this name already exists for this user');
  }
}