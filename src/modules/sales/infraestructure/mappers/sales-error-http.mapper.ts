import { HttpStatus } from "@nestjs/common";
import { SALES_ERROR_CODES } from "../../domain/errors/codes/sales-codes.error";

export const SALES_ERROR_HTTP = {
  [SALES_ERROR_CODES.INSUFFICIENT_STOCK]: HttpStatus.UNPROCESSABLE_ENTITY,
};
