import { type AvailableStock, CONSTRAINT_NAME, type ProductStock, type Stock, type Uuid } from "@libs/contract";
import { ENTITY_NAME, useBaseProps } from "@libs/core";
import { defineEntity, type Loaded, type Opt, p, wrap } from "@mikro-orm/core";

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
    {
      name: CONSTRAINT_NAME.STOCK_ON_HAND,
      property: "onHand",
      expression: ({ onHand }): string => `${onHand} >= 0`,
    },
    {
      name: CONSTRAINT_NAME.STOCK_RESERVED,
      property: "reserved",
      expression: ({ reserved, onHand }): string => `${reserved} >= 0 and ${reserved} <= ${onHand}`,
    },
  ],
});

export class StockEntity extends StockSchema.class {
  get available(): Opt<number> {
    return this.onHand - this.reserved;
  }

  toProductStock(this: StockEntity): ProductStock {
    const data = wrap(this).serialize({ fields: ["onHand", "reserved"] });

    return { ...data, available: this.available };
  }

  toResponse(this: Loaded<StockEntity, never, never, "reservations">): Stock {
    const data = wrap(this).serialize({ exclude: ["reservations"] });

    return { ...data, available: this.available };
  }

  toAvailableStock(this: Loaded<StockEntity, never, never, "shopId" | "reservations">): AvailableStock {
    const data = wrap(this).serialize({
      exclude: ["shopId", "onHand", "reserved", "reservations"],
    });

    return { ...data, available: this.available };
  }
}
StockSchema.setClass(StockEntity);
