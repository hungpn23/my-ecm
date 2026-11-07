import { type } from "arktype";

import { POSTGRES_INTEGER_MAX } from "../shared/common.constant";
import { DateFromISOString } from "../shared/date.schema";
import { EntityRpcResponse } from "../shared/entity-response.rpc-schema";
import { Uuid } from "../shared/string.schema";
import { Reservation } from "./reservation.schema";
import { ProductStock } from "./stock.schema";

export const CreateStock = type({ productId: Uuid, shopId: Uuid }).merge(ProductStock.pick("onHand"));
export type CreateStock = typeof CreateStock.infer;

export const ReserveStock = type({
  checkoutId: Uuid,
  quantity: type("number.integer >= 1").atMost(POSTGRES_INTEGER_MAX),
  productId: Uuid,
  shopId: Uuid,
});
export type ReserveStock = typeof ReserveStock.infer;

export const GetReservationByCheckoutId = type({ checkoutId: Uuid });
export type GetReservationByCheckoutId = typeof GetReservationByCheckoutId.infer;

export const CommitStock = type({ checkoutId: Uuid, paymentId: Uuid });
export type CommitStock = typeof CommitStock.infer;

export const ReservationRpc = Reservation.merge(EntityRpcResponse).merge({ expiresAt: DateFromISOString });
export type ReservationRpc = typeof ReservationRpc.infer;

export const NullableReservationRpc = ReservationRpc.or("null");
export type NullableReservationRpc = typeof NullableReservationRpc.infer;
