import { type } from "arktype";

export const CHECKOUT_STATUSES = ["OPEN", "PAYMENT_PENDING", "ORDER_CREATED", "EXPIRED"] as const;
export const CheckoutStatus = type.enumerated(...CHECKOUT_STATUSES);
export type CheckoutStatus = typeof CheckoutStatus.infer;

export const PAYMENT_METHODS = ["ONLINE"] as const;
export const PaymentMethod = type.enumerated(...PAYMENT_METHODS);
export type PaymentMethod = typeof PaymentMethod.infer;
