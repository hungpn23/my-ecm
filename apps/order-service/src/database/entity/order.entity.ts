import { ORDER_STATUSES } from "@libs/contract";
import { ENTITY_NAME, useBaseProps } from "@libs/core";
import { defineEntity, p } from "@mikro-orm/core";

import { CheckoutEntity } from "./checkout.entity";

export const OrderSchema = defineEntity({
  name: ENTITY_NAME.ORDER,
  tableName: "order",
  properties: useBaseProps({
    checkout: () => p.oneToOne(CheckoutEntity).lazyRef().deleteRule("no action"),
    status: p.enum(ORDER_STATUSES),
  }),
});

export class OrderEntity extends OrderSchema.class {}
OrderSchema.setClass(OrderEntity);
