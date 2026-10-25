import { RESERVATION_STATUS, type Uuid } from "@libs/contract";
import { AGGREGATE_TYPE, useBaseProps } from "@libs/core";
import { defineEntity, p } from "@mikro-orm/core";

import { StockEntity } from "./stock.entity";

export const ReservationSchema = defineEntity({
  name: AGGREGATE_TYPE.RESERVATION,
  properties: useBaseProps({
    checkoutId: p.uuid().unique().$type<Uuid>(),
    stock: () => p.manyToOne(StockEntity).lazyRef().inversedBy("reservations"),
    quantity: p.integer(),
    status: p.enum(RESERVATION_STATUS),
    expiresAt: p.datetime(),
  }),
  checks: [{ property: "quantity", expression: ({ quantity }): string => `${quantity} > 0` }],
});

export class ReservationEntity extends ReservationSchema.class {}
ReservationSchema.setClass(ReservationEntity);
