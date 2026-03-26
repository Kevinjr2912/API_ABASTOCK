import { HttpStatus } from "@nestjs/common";
import { STORES_ERROR_CODES } from "../../application/errors/codes/stores-codes.error";

export const STORES_ERROR_HTTP = {
  [STORES_ERROR_CODES.EXISTING_STORE]: HttpStatus.CONFLICT
};