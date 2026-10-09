import { defineEntity, p } from "@mikro-orm/core";

export const AuthMfaFailureSchema = defineEntity({
  name: "AuthMfaFailure",
  properties: {
    id: p.integer().primary().autoincrement(),
    userId: p.text(),
    failedAt: p.datetime().index(),
  },
  indexes: [{ properties: ["userId", "failedAt"] }],
});

export class AuthMfaFailure extends AuthMfaFailureSchema.class {}
AuthMfaFailureSchema.setClass(AuthMfaFailure);
