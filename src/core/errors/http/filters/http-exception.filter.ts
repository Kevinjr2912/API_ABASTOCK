import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";
import { ApplicationError } from "../../application-error";
import { ERROR_HTTP_MAPPER } from "../error-http.mapper";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof ApplicationError) {
      const status =
        ERROR_HTTP_MAPPER[exception.code] ??
        HttpStatus.INTERNAL_SERVER_ERROR;

      return response.status(status).json({
        success: false,
        error: {
          code: exception.code,
          message: exception.message,
          details: [],
        },
      });
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();

      let message: string | string[] = "Error";
      let details: any[] = [];
      let code = "HTTP_EXCEPTION";

      if (typeof res === "string") {
        message = res;
      } else if (typeof res === "object" && res !== null) {
        const r = res as any;

        message = r.message ?? message;

        if (Array.isArray(r.message)) {
          details = r.message;
          message = "Validation error";
        }

        code =
          r.error?.toUpperCase().replace(/\s/g, "_") ??
          code;
      }

      return response.status(status).json({
        success: false,
        error: {
          code,
          message,
          details,
        },
      });
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
        details: [],
      },
    });
  }
}