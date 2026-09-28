import { KafkaMessageIn, type KafkaMessageOut, X_REQUEST_ID } from "@libs/common";
import { Injectable } from "@nestjs/common";
import type { Serializer } from "@nestjs/microservices";
import { InjectPinoLogger, type PinoLogger } from "nestjs-pino";
import { v7 } from "uuid";

@Injectable()
export class KafkaPayloadSerializerService implements Serializer<KafkaMessageIn, KafkaMessageOut> {
  constructor(
    @InjectPinoLogger(KafkaPayloadSerializerService.name)
    private readonly logger: PinoLogger,
  ) {}

  serialize(payload: KafkaMessageIn): KafkaMessageOut {
    const message = KafkaMessageIn.assert(payload);

    const reqId = String(this.logger.logger.bindings()["reqId"] ?? v7());

    if (!message.headers?.[X_REQUEST_ID]) {
      message.headers = {
        ...message.headers,
        [X_REQUEST_ID]: reqId,
      };
    }

    return message;
  }
}
