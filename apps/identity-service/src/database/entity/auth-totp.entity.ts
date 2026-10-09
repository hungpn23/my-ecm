import { defineEntity, p } from "@mikro-orm/core";

export const AuthTotpSchema = defineEntity({
  name: "AuthTotp",
  properties: {
    userId: p.text().primary(),
    secret: p.text().hidden(),
    confirmed: p.boolean(),
    pendingSecret: p.text().nullable().hidden(),
    lastUsedStep: p.integer().nullable(),
  },
});

export class AuthTotp extends AuthTotpSchema.class {}
AuthTotpSchema.setClass(AuthTotp);
