import {
  Injectable,
  Optional,
  StandardSchemaValidationPipe,
  type StandardSchemaValidationPipeOptions,
  UnprocessableEntityException,
} from "@nestjs/common";
import { ArkErrors } from "arktype";

import { deepMerge } from "../helper/deep-merge";

@Injectable()
export class ArktypeValidationPipe extends StandardSchemaValidationPipe {
  static defaultOptions: StandardSchemaValidationPipeOptions = {
    transform: true,
    validateCustomDecorators: true,
    exceptionFactory: (issues) => {
      if (issues instanceof ArkErrors) {
        const messages: string[] = [];
        for (const [path, message] of Object.entries(issues.flatProblemsByPath)) {
          messages.push(`${path}: ${message.join(", ")}`);
        }

        return new UnprocessableEntityException(messages);
      }

      return new UnprocessableEntityException("Validation failed");
    },
  };

  constructor(@Optional() options?: StandardSchemaValidationPipeOptions) {
    super(deepMerge(ArktypeValidationPipe.defaultOptions, options));
  }
}
