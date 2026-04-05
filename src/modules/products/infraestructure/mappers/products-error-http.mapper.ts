import { HttpStatus } from "@nestjs/common";
import { PRODUCTS_ERROR_CODES } from "../../domain/errors/codes/codes.error";

export const PRODUCTS_ERROR_HTTP = {
  [PRODUCTS_ERROR_CODES.EXISTING_PRODUCT_PRESENTATION]: HttpStatus.CONFLICT
};