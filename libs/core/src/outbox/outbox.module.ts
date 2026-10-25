import { Global, Module } from "@nestjs/common";

import { OutboxService } from "./outbox.service";

/**
 * @ignore Currently Unused.
 * @deprecated The Kafka/outbox/Debezium pipeline is deprecated. Do not use it for new integrations.
 */
@Global()
@Module({
  providers: [OutboxService],
  exports: [OutboxService],
})
export class OutboxModule {}
