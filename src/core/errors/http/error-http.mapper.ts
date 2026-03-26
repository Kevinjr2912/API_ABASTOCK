import { AUTH_ERROR_HTTP } from "src/modules/auth/infraestructure/mappers/auth-error-http.mapper";
import { USERS_ERROR_HTTP } from "src/modules/users/infraestructure/mappers/users-error-http.mapper";
import { STORES_ERROR_HTTP } from "src/modules/stores/infraestructure/mappers/stores-error-http.mapper";

export const ERROR_HTTP_MAPPER = {
  ...AUTH_ERROR_HTTP,
  ...USERS_ERROR_HTTP,
  ...STORES_ERROR_HTTP,
};