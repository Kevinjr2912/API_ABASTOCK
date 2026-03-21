import { ApplicationError } from "src/core/errors/application-error";
import { ERROR_CODES } from "src/core/errors/error-codes";

export class InvalidCredentialsError extends ApplicationError {
  code = ERROR_CODES.INVALID_CREDENTIALS;

  constructor() {
    super('Invalid email or password');
  }
}