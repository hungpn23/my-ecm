import {
  type ArgumentsHost,
  Catch,
  GatewayTimeoutException,
  HttpException,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { TimeoutError } from "rxjs";

type HandledError = TimeoutError;

@Catch(TimeoutError)
export class RxjsExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(RxjsExceptionFilter.name);

  override catch(exception: HandledError, host: ArgumentsHost): void {
    this.logger.warn(`${exception.name}: ${exception.message}`);

    super.catch(this._toHttpException(exception), host);
  }

  private _toHttpException(e: HandledError): HttpException {
    if (e instanceof TimeoutError) return new GatewayTimeoutException(e.message);

    return new InternalServerErrorException();
  }
}
