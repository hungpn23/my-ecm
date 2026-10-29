import { RESERVATION_STATUSES, type Uuid } from "@libs/contract";
import { ENTITY_NAME, useBaseProps } from "@libs/core";
import { defineEntity, p } from "@mikro-orm/core";

import { StockEntity } from "./stock.entity";

export const ReservationSchema = defineEntity({
  name: ENTITY_NAME.RESERVATION,
  tableName: "reservation",
  properties: useBaseProps({
    checkoutId: p.uuid().unique().$type<Uuid>(),
    stock: () => p.manyToOne(StockEntity).lazyRef().inversedBy("reservations"),
    quantity: p.integer(),
    status: p.enum(RESERVATION_STATUSES),
    expiresAt: p.datetime(),
  }),
  checks: [{ property: "quantity", expression: ({ quantity }): string => `${quantity} > 0` }],
});

export class ReservationEntity extends ReservationSchema.class {}
ReservationSchema.setClass(ReservationEntity);
