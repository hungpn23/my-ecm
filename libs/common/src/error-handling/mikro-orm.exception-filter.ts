import { NotFoundError, OptimisticLockError } from "@mikro-orm/core";
import {
  type ArgumentsHost,
  Catch,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

type HandledError = NotFoundError | OptimisticLockError;

@Catch(NotFoundError, OptimisticLockError)
export class MikroOrmExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(MikroOrmExceptionFilter.name);

  override catch(exception: HandledError, host: ArgumentsHost): void {
    this.logger.warn(`${exception.name}: ${exception.message}`);

    super.catch(this._toHttpException(exception), host);
  }

  private _toHttpException(e: HandledError): HttpException {
    if (e instanceof NotFoundError) return new NotFoundException(e.message);

    if (e instanceof OptimisticLockError) {
      return new ConflictException("Resource was modified, please reload and retry");
    }

    return new InternalServerErrorException();
  }
}
