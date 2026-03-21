import { ApplicationError } from 'src/core/errors/application-error';
import { ERROR_CODES } from 'src/core/errors/error-codes';

export class SessionExpiredError extends ApplicationError {
  code = ERROR_CODES.SESSION_EXPIRED;

  constructor() {
    super('Session expired, please log in again');
  }
}