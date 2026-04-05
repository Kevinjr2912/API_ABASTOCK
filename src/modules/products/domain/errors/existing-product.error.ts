import { ApplicationError } from "../../../../core/errors/application-error";
import { PRODUCTS_ERROR_CODES } from "./codes/codes.error";

export class ExistingProductPresentationError extends ApplicationError {
  code = PRODUCTS_ERROR_CODES.EXISTING_PRODUCT_PRESENTATION;
  
  constructor() {
    super(`The product presentation already exists`);
  }
}