import { type } from "arktype";

import { POSTGRES_INTEGER_MAX } from "../shared/common.constant";
import { DateToISOString } from "../shared/date.schema";
import { EntityResponse } from "../shared/entity-response.schema";
import { Uuid } from "../shared/string.schema";

export const RESERVATION_STATUSES = ["HELD", "COMMITTED", "EXPIRED"] as const;
export const ReservationStatus = type.enumerated(...RESERVATION_STATUSES);
export type ReservationStatus = typeof ReservationStatus.infer;

export const Reservation = EntityResponse.merge({
  checkoutId: Uuid,
  committedPaymentId: Uuid.or("null"),
  productId: Uuid,
  shopId: Uuid,
  quantity: type("number.integer >= 1").atMost(POSTGRES_INTEGER_MAX),
  status: ReservationStatus,
  expiresAt: DateToISOString,
});
export type Reservation = typeof Reservation.inferIn;

export const NullableReservation = Reservation.or("null");
export type NullableReservation = typeof NullableReservation.inferIn;
