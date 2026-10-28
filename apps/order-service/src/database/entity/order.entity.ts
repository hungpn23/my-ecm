import { ORDER_STATUS } from "@libs/contract";
import { AGGREGATE_TYPE, useBaseProps } from "@libs/core";
import { defineEntity, p } from "@mikro-orm/core";

import { CheckoutEntity } from "./checkout.entity";

export const OrderSchema = defineEntity({
  name: AGGREGATE_TYPE.ORDER,
  properties: useBaseProps({
    checkout: () => p.oneToOne(CheckoutEntity).lazyRef().deleteRule("no action"),
    status: p.enum(ORDER_STATUS),
  }),
});

export class OrderEntity extends OrderSchema.class {}
OrderSchema.setClass(OrderEntity);
