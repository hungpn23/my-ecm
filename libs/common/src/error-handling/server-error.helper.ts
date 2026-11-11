import { type ServerError, ServerErrorMessage } from "@libs/contract";
import { NotFoundError, OptimisticLockError } from "@mikro-orm/core";
import { HttpException, HttpStatus } from "@nestjs/common";
import { TimeoutError } from "rxjs";

export function toServerError(exception: unknown): ServerError {
  if (exception instanceof HttpException) {
    const statusCode = exception.getStatus();
    const response = exception.getResponse();

    return {
      statusCode,
      message: ServerErrorMessage.allows(response) ? response.message : exception.message,
      errorCode: exception.errorCode ?? HttpStatus[statusCode] ?? `HTTP_${statusCode}`,
    };
  }

  if (exception instanceof NotFoundError) {
    return { statusCode: 404, message: "Resource not found", errorCode: "NOT_FOUND" };
  }

  if (exception instanceof OptimisticLockError) {
    return { statusCode: 409, message: "Resource was modified, please reload and retry", errorCode: "CONFLICT" };
  }

  if (exception instanceof TimeoutError) {
    return { statusCode: 504, message: "RPC request timed out", errorCode: "GATEWAY_TIMEOUT" };
  }

  return { statusCode: 500, message: "Internal server error", errorCode: "INTERNAL_SERVER_ERROR" };
}
