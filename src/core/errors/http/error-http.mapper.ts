import { AUTH_ERROR_HTTP } from "../../../modules/auth/infraestructure/mappers/auth-error-http.mapper";
import { PRODUCTS_ERROR_HTTP } from "../../../modules/products/infraestructure/mappers/products-error-http.mapper";
import { STORES_ERROR_HTTP } from "../../../modules/stores/infraestructure/mappers/stores-error-http.mapper";
import { USERS_ERROR_HTTP } from "../../../modules/users/infraestructure/mappers/users-error-http.mapper";
import { INVENTORIES_ERROR_HTTP } from "../../../modules/inventories/infraestructure/mappers/inventories-error-http.mapper";
import { SALES_ERROR_HTTP } from "../../../modules/sales/infraestructure/mappers/sales-error-http.mapper";


export const ERROR_HTTP_MAPPER = {
  ...AUTH_ERROR_HTTP,
  ...USERS_ERROR_HTTP,
  ...STORES_ERROR_HTTP,
  ...PRODUCTS_ERROR_HTTP,
  ...INVENTORIES_ERROR_HTTP,
  ...SALES_ERROR_HTTP
};