import { HttpStatus } from "@nestjs/common";
import { INVENTORY_ERROR_CODES } from "../../application/errors/codes/inventory-codes.error";

export const INVENTORIES_ERROR_HTTP = {
  [INVENTORY_ERROR_CODES.INVENTORY_ALREADY_EXISTS]: HttpStatus.CONFLICT,
  [INVENTORY_ERROR_CODES.INVENTORY_NOT_FOUND]: HttpStatus.NOT_FOUND,
};
