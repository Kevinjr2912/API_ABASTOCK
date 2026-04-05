import { ApplicationError } from "../../../../core/errors/application-error";
import { AUTH_ERROR_CODES } from "./codes/codes.error";

export class SessionNotFoundError extends ApplicationError {
  code = AUTH_ERROR_CODES.SESSION_NOT_FOUND;

  constructor() {
    super('Session not found');
  }
}