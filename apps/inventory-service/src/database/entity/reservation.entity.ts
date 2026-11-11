import { type Reservation, RESERVATION_STATUSES, type Uuid } from "@libs/contract";
import { ENTITY_NAME, useBaseProps } from "@libs/core";
import { defineEntity, type Loaded, type Opt, p, wrap } from "@mikro-orm/core";

import { StockEntity } from "./stock.entity";

export const ReservationSchema = defineEntity({
  name: ENTITY_NAME.RESERVATION,
  tableName: "reservation",
  properties: useBaseProps({
    checkoutId: p.uuid().unique().$type<Uuid>(),
    committedPaymentId: p.uuid().nullable().$type<Uuid>(),
    stock: () => p.manyToOne(StockEntity).lazyRef().inversedBy("reservations"),
    quantity: p.integer(),
    status: p.enum(RESERVATION_STATUSES),
    expiresAt: p.datetime(),
  }),
  checks: [{ property: "quantity", expression: ({ quantity }): string => `${quantity} > 0` }],
});

export class ReservationEntity extends ReservationSchema.class {
  get isHeld(): Opt<boolean> {
    return this.status === "HELD";
  }

  get isCommitted(): Opt<boolean> {
    return this.status === "COMMITTED";
  }

  get isExpired(): Opt<boolean> {
    return this.expiresAt.getTime() <= Date.now();
  }

  toResponse(this: Loaded<ReservationEntity, "stock">): Reservation {
    const { stock, ...data } = wrap(this).serialize({
      populate: ["stock"],
    });

    return {
      ...data,
      committedPaymentId: data.committedPaymentId ?? null,
      productId: stock.productId,
      shopId: stock.shopId,
    };
  }
}
ReservationSchema.setClass(ReservationEntity);
