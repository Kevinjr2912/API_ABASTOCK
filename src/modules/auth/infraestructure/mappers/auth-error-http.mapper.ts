import { HttpStatus } from '@nestjs/common';
import { AUTH_ERROR_CODES } from '../../application/errors/codes/codes.error';

export const AUTH_ERROR_HTTP = {
  [AUTH_ERROR_CODES.INVALID_CREDENTIALS]: HttpStatus.UNAUTHORIZED,
  [AUTH_ERROR_CODES.SESSION_EXPIRED]:     HttpStatus.UNAUTHORIZED,
  [AUTH_ERROR_CODES.SESSION_INVALID]:     HttpStatus.UNAUTHORIZED,
  [AUTH_ERROR_CODES.SESSION_NOT_FOUND]:   HttpStatus.UNAUTHORIZED,
};
