import { defineEntity, p } from "@mikro-orm/core";

export const RecoveryCodeSchema = defineEntity({
  name: "RecoveryCode",
  properties: {
    userId: p.text().primary(),
    codeHash: p.text().primary().hidden(),
  },
});

export class RecoveryCode extends RecoveryCodeSchema.class {}
RecoveryCodeSchema.setClass(RecoveryCode);
