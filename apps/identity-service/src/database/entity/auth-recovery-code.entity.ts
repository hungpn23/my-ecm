import { defineEntity, p } from "@mikro-orm/core";

export const AuthRecoveryCodeSchema = defineEntity({
  name: "AuthRecoveryCode",
  properties: {
    userId: p.text().primary(),
    codeHash: p.text().primary().hidden(),
  },
});

export class AuthRecoveryCode extends AuthRecoveryCodeSchema.class {}
AuthRecoveryCodeSchema.setClass(AuthRecoveryCode);
