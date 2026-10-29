import type { Uuid } from "@libs/contract";
import { ENTITY_NAME, useBaseProps } from "@libs/core";
import { defineEntity, p } from "@mikro-orm/core";

// fallow-ignore-next-line circular-dependency
import { ReservationEntity } from "./reservation.entity";

export const StockSchema = defineEntity({
  name: ENTITY_NAME.STOCK,
  tableName: "stock",
  properties: useBaseProps({
    productId: p.uuid().unique().$type<Uuid>(),
    shopId: p.uuid().$type<Uuid>(),
    onHand: p.integer(),
    reserved: p.integer(),
    reservations: () => p.oneToMany(ReservationEntity).mappedBy("stock"),
  }),
  checks: [
    { property: "onHand", expression: ({ onHand }): string => `${onHand} >= 0` },
    {
      property: "reserved",
      expression: ({ reserved, onHand }): string => `${reserved} >= 0 and ${reserved} <= ${onHand}`,
    },
  ],
});

export class StockEntity extends StockSchema.class {}
StockSchema.setClass(StockEntity);
