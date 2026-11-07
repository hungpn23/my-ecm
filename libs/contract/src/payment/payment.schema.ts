import { type } from "arktype";

import { DateToISOString } from "../shared/date.schema";
import { EntityHttpResponse } from "../shared/entity-response.schema";
import { NonNegativeDecimal } from "../shared/number.schema";
import { Uuid } from "../shared/string.schema";

export const PAYMENT_STATUSES = ["INITIATED", "SUCCEEDED", "FAILED", "EXPIRED"] as const;
export const PaymentStatus = type.enumerated(...PAYMENT_STATUSES);
export type PaymentStatus = typeof PaymentStatus.infer;

export const Payment = EntityHttpResponse.merge({
  checkoutId: Uuid,
  amount: NonNegativeDecimal,
  status: PaymentStatus,
  expiresAt: DateToISOString,
});
export type Payment = typeof Payment.inferIn;
