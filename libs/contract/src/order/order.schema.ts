import { type } from "arktype";

export const ORDER_STATUSES = ["READY_TO_SHIP", "PROCESSED", "SHIPPED", "TO_CONFIRM_RECEIVE", "COMPLETED"] as const;
export const OrderStatus = type.enumerated(...ORDER_STATUSES);
export type OrderStatus = typeof OrderStatus.infer;
