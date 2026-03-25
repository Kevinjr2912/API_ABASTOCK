import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApplicationError } from '../errors/application-error';
import { ERROR_CODES } from '../errors/error-codes';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly errorStatusMap: Record<string, number> = {
    [ERROR_CODES.EMAIL_ALREADY_TAKEN]: HttpStatus.CONFLICT,
    [ERROR_CODES.INVALID_CREDENTIALS]: HttpStatus.UNAUTHORIZED,
    [ERROR_CODES.USER_NOT_FOUND]: HttpStatus.NOT_FOUND,
    [ERROR_CODES.UNAUTHORIZED]: HttpStatus.UNAUTHORIZED,
    [ERROR_CODES.SESSION_INVALID]: HttpStatus.UNAUTHORIZED,
    [ERROR_CODES.SESSION_EXPIRED]: HttpStatus.UNAUTHORIZED,
    [ERROR_CODES.SESSION_NOT_FOUND]: HttpStatus.NOT_FOUND, 
    [ERROR_CODES.EXISTING_STORE]: HttpStatus.CONFLICT,
  };

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Errores de negocio (ApplicationError)
    if (exception instanceof ApplicationError) {
      const status =
        this.errorStatusMap[exception.code] || HttpStatus.BAD_REQUEST;

      return response.status(status).json({
        message: exception.message,
        code: exception.code,
        error: exception.name,
      });
    }

    // Errores de Nest
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();

      return response.status(status).json({
        message: (res as any).message || 'HTTP Error',
        code: 'HTTP_ERROR',
        error: exception.name,
      });
    }

    // Errores inesperados
    console.error(exception);

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
      error: 'InternalServerError',
    });
  }
}
