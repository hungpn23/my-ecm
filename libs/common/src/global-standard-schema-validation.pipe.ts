import {
  HttpStatus,
  Injectable,
  Optional,
  StandardSchemaValidationPipe,
  type StandardSchemaValidationPipeOptions,
} from "@nestjs/common";
import { deepMerge } from "./deep-merge";

@Injectable()
export class GlobalStandardSchemaValidationPipe extends StandardSchemaValidationPipe {
  static defaultOptions: StandardSchemaValidationPipeOptions = {
    transform: true,
    validateCustomDecorators: true,
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  };

  constructor(@Optional() options?: StandardSchemaValidationPipeOptions) {
    super(deepMerge(GlobalStandardSchemaValidationPipe.defaultOptions, options));
  }
}
