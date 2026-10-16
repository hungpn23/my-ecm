import { Outbox } from "#internal/database/entity/index";
import type { KafkaTopic } from "@libs/contract";
import type { RequiredEntityData } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { v7 } from "uuid";
import { MessageByTopic } from "../kafka";

type CreateOutboxData<KTopic extends KafkaTopic> = Omit<
  RequiredEntityData<Outbox>,
  "eventType" | "payload" | "requestId"
> & {
  eventType: KTopic;
  payload: MessageByTopic[NoInfer<KTopic>]["value"];
};

@Injectable()
export class OutboxService {
  constructor(
    @InjectPinoLogger(OutboxService.name)
    private readonly logger: PinoLogger,
    private readonly em: EntityManager,
  ) {}

  async createAndFlush<KTopic extends KafkaTopic>(data: CreateOutboxData<KTopic>): Promise<void> {
    await this.em.transactional(
      async (em) => {
        MessageByTopic[data.eventType].assert({
          value: data.payload,
        });

        em.create(Outbox, {
          ...data,
          requestId: this.logger.logger.bindings()["reqId"] ?? v7(),
        });
      },
      { propagation: "mandatory" },
    );
  }
}
