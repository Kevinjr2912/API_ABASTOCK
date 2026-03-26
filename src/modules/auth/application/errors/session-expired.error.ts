import { ApplicationError } from 'src/core/errors/application-error';
import { AUTH_ERROR_CODES } from "./codes/codes.error";

export class SessionExpiredError extends ApplicationError {
  code = AUTH_ERROR_CODES.SESSION_EXPIRED;

  constructor() {
    super('Session expired, please log in again');
  }
}