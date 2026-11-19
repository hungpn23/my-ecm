import { type } from "arktype";

export const CONSTRAINT_NAME = {
  RESERVATION_QUANTITY: "reservation_quantity_check",
  STOCK_ON_HAND: "stock_on_hand_check",
  STOCK_RESERVED: "stock_reserved_check",
  CHECKOUT_QUANTITY: "checkout_quantity_check",
  CHECKOUT_UNIT_PRICE: "checkout_unit_price_check",
  CHECKOUT_SHIPPING_FEE: "checkout_shipping_fee_check",
  CHECKOUT_TOTAL: "checkout_total_check",
  PAYMENT_AMOUNT: "payment_amount_check",
} as const;

export const ConstraintName = type.enumerated(...Object.values(CONSTRAINT_NAME));
export type ConstraintName = typeof ConstraintName.infer;
