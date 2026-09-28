import { Outbox } from "#internal/database/entity/index";
import type { EntityRepository, RequiredEntityData } from "@mikro-orm/core";
import { Transactional } from "@mikro-orm/decorators/legacy";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { v7 } from "uuid";

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
  async createAndFlush(data: Omit<RequiredEntityData<Outbox>, "requestId">): Promise<void> {
    this.outboxRepo.create({
      ...data,
      requestId: this.logger.logger.bindings()["reqId"] ?? v7(),
    });

    await this.em.flush();
  }
}
