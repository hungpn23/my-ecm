import { Global, Module } from "@nestjs/common";

import { OutboxService } from "./outbox.service";

/** @ignore Currently Unused. */
@Global()
@Module({
  providers: [OutboxService],
  exports: [OutboxService],
})
export class OutboxModule {}
