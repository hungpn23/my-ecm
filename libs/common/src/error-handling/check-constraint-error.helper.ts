import { ConstraintName, type ServerError } from "@libs/contract";

type CheckConstraintError = Pick<ServerError, "message" | "errorCode">;

const CHECK_CONSTRAINT_ERRORS = new Map<ConstraintName, CheckConstraintError>([
  [
    "reservation_quantity_check",
    {
      message: "Reservation quantity must be greater than zero",
      errorCode: "RESERVATION_QUANTITY_INVALID",
    },
  ],
  [
    "stock_on_hand_check",
    {
      message: "Stock on hand cannot be negative",
      errorCode: "STOCK_ON_HAND_INVALID",
    },
  ],
  [
    "stock_reserved_check",
    {
      message: "Reserved stock must be between zero and stock on hand",
      errorCode: "STOCK_RESERVED_INVALID",
    },
  ],
  [
    "checkout_quantity_check",
    {
      message: "Checkout quantity must be greater than zero",
      errorCode: "CHECKOUT_QUANTITY_INVALID",
    },
  ],
  [
    "checkout_unit_price_check",
    {
      message: "Checkout unit price is out of range",
      errorCode: "CHECKOUT_UNIT_PRICE_INVALID",
    },
  ],
  [
    "checkout_shipping_fee_check",
    {
      message: "Checkout shipping fee is out of range",
      errorCode: "CHECKOUT_SHIPPING_FEE_INVALID",
    },
  ],
  [
    "checkout_total_check",
    {
      message: "Checkout total is out of range",
      errorCode: "CHECKOUT_TOTAL_INVALID",
    },
  ],
  [
    "payment_amount_check",
    {
      message: "Payment amount is out of range",
      errorCode: "PAYMENT_AMOUNT_INVALID",
    },
  ],
]);

export function toCheckConstraintError(constraintName: unknown): CheckConstraintError {
  if (ConstraintName.allows(constraintName)) {
    const error = CHECK_CONSTRAINT_ERRORS.get(constraintName);
    if (error) return error;
  }

  return {
    message: "Unknown constraint error",
    errorCode: "UNKNOWN_CONSTRAINT_ERROR",
  };
}
