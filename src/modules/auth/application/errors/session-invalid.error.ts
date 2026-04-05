import { ApplicationError } from "../../../../core/errors/application-error";
import { AUTH_ERROR_CODES } from "./codes/codes.error";

export class SessionInvalidError extends ApplicationError {
  code = AUTH_ERROR_CODES.SESSION_INVALID;

  constructor() {
    super('Session invalid, please log in again');
  }
}