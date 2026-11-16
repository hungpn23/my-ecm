import { type } from "arktype";

import { Uuid } from "../shared/string.schema";
import { Payment } from "./payment.schema";

export const CreatePayment = Payment.pick("checkoutId", "amount", "expiresAt");
export type CreatePayment = typeof CreatePayment.infer;

export const ConfirmPayment = type({ paymentId: Uuid, checkoutId: Uuid });
export type ConfirmPayment = typeof ConfirmPayment.infer;
