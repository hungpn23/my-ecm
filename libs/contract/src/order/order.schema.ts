import { type } from "arktype";

export const ORDER_STATUS = ["READY_TO_SHIP", "PROCESSED", "SHIPPED", "TO_CONFIRM_RECEIVE", "COMPLETED"] as const;
export const OrderStatus = type.enumerated(...ORDER_STATUS);
export type OrderStatus = typeof OrderStatus.infer;
