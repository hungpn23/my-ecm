import { STATUS_CODES } from "node:http";

import { RPC_ERROR, type RpcError } from "@libs/contract";
import { Catch, HttpException, Logger } from "@nestjs/common";
import { BaseRpcExceptionFilter } from "@nestjs/microservices";
import { isObject } from "lodash";
import { type Observable, throwError } from "rxjs";

import { RpcException } from "./rpc.exception";

@Catch()
export class RpcExceptionFilter extends BaseRpcExceptionFilter {
  private readonly logger = new Logger(RpcExceptionFilter.name);

  override catch(exception: unknown): Observable<never> {
    let error: RpcError = RPC_ERROR.INTERNAL_SERVER_ERROR satisfies RpcError;

    if (exception instanceof RpcException) {
      error = exception.payload satisfies RpcError;
    } else if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();

      const defaultErrorCode = STATUS_CODES[statusCode] ?? `Unknown Error (${statusCode})`;
      const code = exception.errorCode ?? defaultErrorCode;

      const response = exception.getResponse();
      const message = isObject(response) && "message" in response ? response.message : exception.message;

      error = { statusCode, code, message } satisfies RpcError;
    } else if (exception instanceof Error) {
      this.logger.error(exception);
      if (exception.cause) this.logger.error(`[REASON]: ${JSON.stringify(exception.cause)}`);
    }

    return throwError(() => error);
  }
}
