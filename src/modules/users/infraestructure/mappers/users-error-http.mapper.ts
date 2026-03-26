import { HttpStatus } from "@nestjs/common";
import { USERS_ERROR_CODES } from "../../application/errors/codes/user-codes.error";

export const USERS_ERROR_HTTP = {
  [USERS_ERROR_CODES.EMAIL_ALREADY_TAKEN]: HttpStatus.CONFLICT,
  [USERS_ERROR_CODES.USER_NOT_FOUND]:      HttpStatus.NOT_FOUND
};
