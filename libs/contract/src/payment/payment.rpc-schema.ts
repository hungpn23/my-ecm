import { type } from "arktype";

import { DateFromISOString, DateToISOString } from "../shared/date.schema";
import { EntityResponseFromRpc } from "../shared/entity-response.rpc-schema";
import { Uuid } from "../shared/string.schema";
import { Payment } from "./payment.schema";

export const CreatePaymentPayload = Payment.pick("checkoutId", "amount").merge({ expiresAt: DateToISOString });
export type CreatePaymentPayload = typeof CreatePaymentPayload.inferIn;

export const CreatePayment = CreatePaymentPayload.merge({ expiresAt: DateFromISOString });
export type CreatePayment = typeof CreatePayment.infer;

export const ConfirmPayment = type({ paymentId: Uuid, checkoutId: Uuid });
export type ConfirmPayment = typeof ConfirmPayment.infer;

export const PaymentFromRpc = Payment.merge(EntityResponseFromRpc).merge({ expiresAt: DateFromISOString });
