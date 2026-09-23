import { KafkaPayload, X_REQUEST_ID, type KafkaMessage } from "@libs/common";
import { Injectable } from "@nestjs/common";
import type { Serializer } from "@nestjs/microservices";
import { InjectPinoLogger, type PinoLogger } from "nestjs-pino";
import { v7 } from "uuid";

@Injectable()
export class KafkaPayloadSerializerService implements Serializer<KafkaPayload, KafkaMessage> {
  constructor(
    @InjectPinoLogger(KafkaPayloadSerializerService.name)
    private readonly logger: PinoLogger,
  ) {}

  serialize(payload: KafkaPayload) {
    const message = KafkaPayload.assert(payload);

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
