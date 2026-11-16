import { type } from "arktype";

import { POSTGRES_INTEGER_MAX } from "../shared/common.constant";
import { Uuid } from "../shared/string.schema";
import { Stock } from "./stock.schema";

export const CreateStock = type({ productId: Uuid, shopId: Uuid }).merge(Stock.pick("onHand"));
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
