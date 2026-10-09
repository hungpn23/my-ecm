import { defineEntity, p } from "@mikro-orm/core";

export const MfaFailureSchema = defineEntity({
  name: "MfaFailure",
  properties: {
    id: p.integer().primary().autoincrement(),
    userId: p.text(),
    failedAt: p.datetime().index(),
  },
  indexes: [{ properties: ["userId", "failedAt"] }],
});

export class MfaFailure extends MfaFailureSchema.class {}
MfaFailureSchema.setClass(MfaFailure);
