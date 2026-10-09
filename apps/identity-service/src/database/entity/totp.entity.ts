import { defineEntity, p } from "@mikro-orm/core";

export const TotpSchema = defineEntity({
  name: "Totp",
  properties: {
    userId: p.text().primary(),
    secret: p.text().hidden(),
    confirmed: p.boolean(),
    pendingSecret: p.text().nullable().hidden(),
    lastUsedStep: p.integer().nullable(),
  },
});

export class Totp extends TotpSchema.class {}
TotpSchema.setClass(Totp);
