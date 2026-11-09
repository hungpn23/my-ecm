import { type } from "arktype";

import { ReserveStock } from "../inventory/stock.rpc-schema";
import { Payment } from "../payment/payment.schema";
import { DateToISOString } from "../shared/date.schema";
import { EntityResponse } from "../shared/entity-response.schema";
import { NonNegativeDecimal } from "../shared/number.schema";
import { Uuid, Varchar255 } from "../shared/string.schema";

export const CHECKOUT_STATUSES = ["OPEN", "PAYMENT_PENDING", "ORDER_CREATED", "EXPIRED"] as const;
export const CheckoutStatus = type.enumerated(...CHECKOUT_STATUSES);
export type CheckoutStatus = typeof CheckoutStatus.infer;

export const PAYMENT_METHODS = ["ONLINE"] as const;
export const PaymentMethod = type.enumerated(...PAYMENT_METHODS);
export type PaymentMethod = typeof PaymentMethod.infer;

export const OpenCheckout = ReserveStock.pick("productId", "quantity").merge({
  addressId: Uuid,
  paymentMethod: PaymentMethod,
});
export type OpenCheckout = typeof OpenCheckout.infer;

export const ConfirmCheckout = type({ paymentId: Uuid });
export type ConfirmCheckout = typeof ConfirmCheckout.infer;

export const Checkout = EntityResponse.merge(OpenCheckout.pick("productId", "quantity", "paymentMethod")).merge({
  userId: Uuid,
  shopId: Uuid,
  productName: "string",
  unitPrice: NonNegativeDecimal,
  shippingFee: NonNegativeDecimal,
  total: NonNegativeDecimal,
  recipientName: Varchar255,
  phone: Varchar255,
  shippingAddress: "string",
  status: CheckoutStatus,
  expiresAt: DateToISOString,
});
export type Checkout = typeof Checkout.inferIn;

export const ProcessPaymentResponse = type({ checkout: Checkout, payment: Payment });
export type ProcessPaymentResponse = typeof ProcessPaymentResponse.inferIn;
