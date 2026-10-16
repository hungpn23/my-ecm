import { RPC_ERROR, type RpcError } from "@libs/contract";
import { Catch, HttpException, Logger } from "@nestjs/common";
import { BaseRpcExceptionFilter } from "@nestjs/microservices";
import { throwError, type Observable } from "rxjs";
import { RpcException } from "./rpc.exception";

@Catch()
export class GlobalRpcExceptionFilter extends BaseRpcExceptionFilter {
  private readonly logger = new Logger(GlobalRpcExceptionFilter.name);

  override catch(exception: any): Observable<never> {
    let error: RpcError = RPC_ERROR.INTERNAL_SERVER_ERROR satisfies RpcError;

    if (exception instanceof RpcException) {
      error = exception.payload satisfies RpcError;

      return throwError(() => error);
    }

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const { errorCode = `HTTP_${statusCode}`, message } = exception;

      error = { statusCode, code: errorCode, message } satisfies RpcError;

      return throwError(() => error);
    }

    if (exception instanceof Error) {
      this.logger.error(exception);
      if (exception.cause) this.logger.error(`[REASON]: ${JSON.stringify(exception.cause)}`);
    }

    return throwError(() => error);
  }
}
