import { AGGREGATE_TYPE, AggregateType } from "#internal/outbox/aggregate-type.schema";
import { KafkaTopic, Uuid, type AnyRecord } from "@libs/common";
import { defineEntity, p } from "@mikro-orm/core";
import { v7 } from "uuid";

export const OutboxSchema = defineEntity({
  name: AGGREGATE_TYPE.OUTBOX,
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

export class Outbox extends OutboxSchema.class {}
OutboxSchema.setClass(Outbox);
