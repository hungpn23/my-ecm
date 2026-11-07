import { type NonNegativeDecimal, type Payment, PAYMENT_STATUSES, type Uuid } from "@libs/contract";
import { ENTITY_NAME, useBaseProps } from "@libs/core";
import { defineEntity, type Opt, p, wrap } from "@mikro-orm/core";

export const PaymentSchema = defineEntity({
  name: ENTITY_NAME.PAYMENT,
  tableName: "payment",
  properties: useBaseProps({
    checkoutId: p.uuid().$type<Uuid>(),
    amount: p.decimal().precision(12).scale(2).$type<NonNegativeDecimal>(),
    status: p.enum(PAYMENT_STATUSES),
    expiresAt: p.datetime(),
  }),
  checks: [{ property: "amount", expression: ({ amount }): string => `${amount} between 0 and 9999999999.99` }],
});

export class PaymentEntity extends PaymentSchema.class {
  get isExpired(): Opt<boolean> {
    return this.expiresAt.getTime() <= Date.now();
  }

  toResponse(this: PaymentEntity): Payment {
    return wrap(this).serialize();
  }
}
PaymentSchema.setClass(PaymentEntity);
