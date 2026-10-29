import { type } from "arktype";

export const RESERVATION_STATUSES = ["HELD", "COMMITTED", "EXPIRED"] as const;
export const ReservationStatus = type.enumerated(...RESERVATION_STATUSES);
export type ReservationStatus = typeof ReservationStatus.infer;
