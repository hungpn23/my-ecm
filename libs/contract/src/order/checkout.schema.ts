import { type } from "arktype";

export const CHECKOUT_STATUS = ["OPEN", "PAYMENT_PENDING", "ORDER_CREATED", "EXPIRED"] as const;
export const CheckoutStatus = type.enumerated(...CHECKOUT_STATUS);
export type CheckoutStatus = typeof CheckoutStatus.infer;

export const PAYMENT_METHOD = ["ONLINE"] as const;
export const PaymentMethod = type.enumerated(...PAYMENT_METHOD);
export type PaymentMethod = typeof PaymentMethod.infer;
