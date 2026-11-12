import { STATUS_CODES } from "node:http";

import { type ArgumentsHost, Catch, Logger } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

import { toServerError } from "./server-error.helper";

@Catch()
export class ServerExceptionFilter {
  private readonly logger = new Logger(ServerExceptionFilter.name);

  constructor(private readonly adapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const error = toServerError(exception);

    if (error.statusCode >= 500 && Error.isError(exception)) {
      this.logger.error(exception, "ServerExceptionFilter caught an server error");
    }

    const { statusCode, message, errorCode } = error;
    this.adapterHost.httpAdapter.reply(
      host.switchToHttp().getResponse(),
      {
        statusCode,
        error: STATUS_CODES[statusCode] ?? "Unknown Error",
        message,
        errorCode,
        timestamp: new Date().toISOString(),
      },
      statusCode,
    );
  }
}
