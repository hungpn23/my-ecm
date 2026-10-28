import { CHECKOUT_STATUS, type NonNegativeDecimal, PAYMENT_METHOD, type Uuid } from "@libs/contract";
import { AGGREGATE_TYPE, useBaseProps } from "@libs/core";
import { defineEntity, p } from "@mikro-orm/core";

export const CheckoutSchema = defineEntity({
  name: AGGREGATE_TYPE.CHECKOUT,
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
    paymentMethod: p.enum(PAYMENT_METHOD),
    status: p.enum(CHECKOUT_STATUS),
    expiresAt: p.datetime().nullable(),
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

export class CheckoutEntity extends CheckoutSchema.class {}
CheckoutSchema.setClass(CheckoutEntity);
