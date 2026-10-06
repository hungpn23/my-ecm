import { Outbox } from "#internal/database/entity/index";
import { KafkaMessageByTopic } from "@libs/common";
import type { KafkaTopic } from "@libs/contract";
import type { EntityRepository, RequiredEntityData } from "@mikro-orm/core";
import { Transactional } from "@mikro-orm/decorators/legacy";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { v7 } from "uuid";

type CreateOutboxData<KTopic extends KafkaTopic> = Omit<
  RequiredEntityData<Outbox>,
  "eventType" | "payload" | "requestId"
> & {
  eventType: KTopic;
  payload: KafkaMessageByTopic[NoInfer<KTopic>]["value"];
};

@Injectable()
export class OutboxService {
  constructor(
    @InjectPinoLogger(OutboxService.name)
    private readonly logger: PinoLogger,
    @InjectRepository(Outbox)
    private readonly outboxRepo: EntityRepository<Outbox>,
    private readonly em: EntityManager,
  ) {}

  @Transactional({ propagation: "mandatory" })
  async createAndFlush<KTopic extends KafkaTopic>(data: CreateOutboxData<KTopic>): Promise<void> {
    KafkaMessageByTopic[data.eventType].assert({
      value: data.payload,
    });

    this.outboxRepo.create({
      ...data,
      requestId: this.logger.logger.bindings()["reqId"] ?? v7(),
    });

    await this.em.flush();
  }
}
