import { type AnyRecord, KafkaTopic, Uuid } from "@libs/contract";
import { defineEntity, p } from "@mikro-orm/core";
import { v7 } from "uuid";

import { AggregateType, ENTITY_NAME } from "#internal/outbox/aggregate-type.schema";

export const OutboxSchema = defineEntity({
  name: ENTITY_NAME.OUTBOX,
  tableName: "outbox",
  properties: {
    id: p
      .uuid()
      .primary()
      .onCreate(() => v7())
      .$type<Uuid>(),
    aggregateType: p.string().$type<AggregateType>(),
    aggregateId: p.string(),
    eventType: p.string().$type<KafkaTopic>(),
    payload: p.json<AnyRecord>(),
    requestId: p.uuid().$type<Uuid>(),
    createdAt: p.datetime().onCreate(() => new Date()),
  },
});

export class OutboxEntity extends OutboxSchema.class {}
OutboxSchema.setClass(OutboxEntity);
