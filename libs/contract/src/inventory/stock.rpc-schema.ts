import { type } from "arktype";

import { POSTGRES_INTEGER_MAX } from "../shared/common.constant";
import { Uuid } from "../shared/string.schema";
import { ReservationStatus } from "./reservation.schema";

export const ReserveStock = type({
  checkoutId: Uuid,
  quantity: type("number.integer >= 1").atMost(POSTGRES_INTEGER_MAX),
  productId: Uuid,
  shopId: Uuid,
});
export type ReserveStock = typeof ReserveStock.infer;

export const GetReservationByCheckoutId = type({ checkoutId: Uuid });
export type GetReservationByCheckoutId = typeof GetReservationByCheckoutId.infer;

export const StockReservation = ReserveStock.merge({
  id: Uuid,
  status: ReservationStatus,
  expiresAt: "string.date.iso",
});
export type StockReservation = typeof StockReservation.infer;

export const NullableStockReservation = StockReservation.or("null");
export type NullableStockReservation = typeof NullableStockReservation.infer;
