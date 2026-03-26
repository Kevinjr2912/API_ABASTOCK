import { ApplicationError } from "src/core/errors/application-error";
import { AUTH_ERROR_CODES } from "./codes/codes.error";

export class InvalidCredentialsError extends ApplicationError {
  code = AUTH_ERROR_CODES.INVALID_CREDENTIALS;

  constructor() {
    super('Invalid email or password');
  }
}