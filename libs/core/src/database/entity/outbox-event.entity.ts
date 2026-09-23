import type { AnyRecord } from "@libs/common";
import { defineEntity, p } from "@mikro-orm/core";
import { v7 } from "uuid";

export const OutboxEventSchema = defineEntity({
  name: "OutboxEvent",
  properties: {
    id: p
      .uuid()
      .primary()
      .onCreate(() => v7()),
    aggregateType: p.string(),
    aggregateId: p.string(),
    eventType: p.string(),
    payload: p.json<AnyRecord>(),
    metadata: p.json<AnyRecord>().default("{}"),
    createdAt: p.datetime().onCreate(() => new Date()),
  },
});

export class OutboxEvent extends OutboxEventSchema.class {}
OutboxEventSchema.setClass(OutboxEvent);
