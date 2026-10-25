import { type } from "arktype";

export const RESERVATION_STATUS = ["HELD", "COMMITTED", "EXPIRED"] as const;
export const ReservationStatus = type.enumerated(...RESERVATION_STATUS);
export type ReservationStatus = typeof ReservationStatus.infer;
