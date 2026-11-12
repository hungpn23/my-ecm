import { Catch, Logger } from "@nestjs/common";
import { BaseRpcExceptionFilter } from "@nestjs/microservices";
import { type Observable, throwError } from "rxjs";

import { toServerError } from "./server-error.helper";

@Catch()
export class RpcExceptionFilter extends BaseRpcExceptionFilter {
  private readonly logger = new Logger(RpcExceptionFilter.name);

  override catch(exception: unknown): Observable<never> {
    const error = toServerError(exception);

    if (error.statusCode >= 500 && Error.isError(exception)) {
      this.logger.error(exception, "RpcExceptionFilter caught an server error");
    }

    return throwError(() => error);
  }
}
