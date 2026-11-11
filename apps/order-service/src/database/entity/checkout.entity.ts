import { type Checkout, CHECKOUT_STATUSES, type NonNegativeDecimal, PAYMENT_METHODS, type Uuid } from "@libs/contract";
import { ENTITY_NAME, useBaseProps } from "@libs/core";
import { defineEntity, type Opt, p, wrap } from "@mikro-orm/core";

export const CheckoutSchema = defineEntity({
  name: ENTITY_NAME.CHECKOUT,
  tableName: "checkout",
  properties: useBaseProps({
    userId: p.uuid().$type<Uuid>(),
    shopId: p.uuid().$type<Uuid>(),
    productId: p.uuid().$type<Uuid>(),
    productName: p.string(),
    unitPrice: p.decimal().precision(12).scale(2).$type<NonNegativeDecimal>(),
    quantity: p.integer(),
    shippingFee: p.decimal().precision(12).scale(2).$type<NonNegativeDecimal>(),
    total: p.decimal().precision(12).scale(2).$type<NonNegativeDecimal>(),
    recipientName: p.string(),
    phone: p.string(),
    shippingAddress: p.text(),
    paymentMethod: p.enum(PAYMENT_METHODS),
    status: p.enum(CHECKOUT_STATUSES),
    expiresAt: p.datetime(),
  }),
  checks: [
    { property: "quantity", expression: ({ quantity }): string => `${quantity} > 0` },
    {
      property: "unitPrice",
      expression: ({ unitPrice }): string => `${unitPrice} between 0 and 9999999999.99`,
    },
    {
      property: "shippingFee",
      expression: ({ shippingFee }): string => `${shippingFee} between 0 and 9999999999.99`,
    },
    {
      property: "total",
      expression: ({ total }): string => `${total} between 0 and 9999999999.99`,
    },
  ],
});

export class CheckoutEntity extends CheckoutSchema.class {
  get isOpen(): Opt<boolean> {
    return this.status === "OPEN";
  }

  get isExpired(): Opt<boolean> {
    return this.expiresAt.getTime() <= Date.now();
  }

  get isAwaitingPayment(): Opt<boolean> {
    return this.status === "PAYMENT_PENDING";
  }

  toResponse(this: CheckoutEntity): Checkout {
    return wrap(this).serialize();
  }
}
CheckoutSchema.setClass(CheckoutEntity);
