import { ApplicationError } from 'src/core/errors/application-error';
import { ERROR_CODES } from 'src/core/errors/error-codes';

export class SessionNotFoundError extends ApplicationError {
  code = ERROR_CODES.SESSION_NOT_FOUND;

  constructor() {
    super('Session not found');
  }
}