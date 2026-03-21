import { ApplicationError } from "src/core/errors/application-error";
import { ERROR_CODES } from "src/core/errors/error-codes";

export class EmailAlreadyTakenError extends ApplicationError {
  code = ERROR_CODES.EMAIL_ALREADY_TAKEN;

  constructor(email: string) {
    super(`Email ${email} is already taken`);
  }
}