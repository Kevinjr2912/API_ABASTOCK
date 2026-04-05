import { ApplicationError } from "../../../../core/errors/application-error";
import { USERS_ERROR_CODES } from "./codes/user-codes.error";

export class EmailAlreadyTakenError extends ApplicationError {
  code = USERS_ERROR_CODES.EMAIL_ALREADY_TAKEN;

  constructor(email: string) {
    super(`Email ${email} is already taken`);
  }
}