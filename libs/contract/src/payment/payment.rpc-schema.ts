import { type } from "arktype";

import { DateFromISOString, DateToISOString } from "../shared/date.schema";
import { EntityResponseFromRpc } from "../shared/entity-response.rpc-schema";
import { Uuid } from "../shared/string.schema";
import { Payment } from "./payment.schema";

export const CreatePayment = Payment.pick("checkoutId", "amount").merge({ expiresAt: DateToISOString });
export type CreatePayment = typeof CreatePayment.inferIn;

export const CreatePaymentPayload = CreatePayment.merge({ expiresAt: DateFromISOString });
export type CreatePaymentPayload = typeof CreatePaymentPayload.infer;

export const ConfirmPayment = type({ paymentId: Uuid, checkoutId: Uuid });
export type ConfirmPayment = typeof ConfirmPayment.infer;

export const PaymentFromRpc = Payment.merge(EntityResponseFromRpc).merge({ expiresAt: DateFromISOString });
