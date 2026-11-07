import { type } from "arktype";

import { DateFromISOString } from "../shared/date.schema";
import { EntityRpcResponse } from "../shared/entity-response.rpc-schema";
import { Uuid } from "../shared/string.schema";
import { Payment } from "./payment.schema";

export const CreatePayment = Payment.pick("checkoutId", "amount").merge({ expiresAt: DateFromISOString });
export type CreatePayment = typeof CreatePayment.infer;

export const ConfirmPayment = type({ paymentId: Uuid, checkoutId: Uuid });
export type ConfirmPayment = typeof ConfirmPayment.infer;

export const PaymentRpc = Payment.merge(EntityRpcResponse).merge({ expiresAt: DateFromISOString });
export type PaymentRpc = typeof PaymentRpc.infer;
