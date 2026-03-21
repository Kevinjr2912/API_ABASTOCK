import { ApplicationError } from 'src/core/errors/application-error';
import { ERROR_CODES } from 'src/core/errors/error-codes';

export class SessionInvalidError extends ApplicationError {
  code = ERROR_CODES.SESSION_INVALID;

  constructor() {
    super('Session invalid, please log in again');
  }
}