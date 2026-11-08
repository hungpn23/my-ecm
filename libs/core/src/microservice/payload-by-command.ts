import {
  CommitStock,
  ConfirmPayment,
  CreatePaymentPayload,
  CreateStock,
  GetAddressById,
  GetProductsByIds,
  GetReservationByCheckoutId,
  GetUserById,
  ReserveStock,
} from "@libs/contract";
import type { Type } from "arktype";

import type { MicroserviceCommand } from "./microservice.rpc-schema";

export const PayloadByCommand = {
  "get.user.by-id": GetUserById,
  "get.address.by-id": GetAddressById,
  "get.products.by-ids": GetProductsByIds,
  "create.stock": CreateStock,
  "reserve.stock": ReserveStock,
  "get.reservation.by-checkout-id": GetReservationByCheckoutId,
  "create.payment": CreatePaymentPayload,
  "confirm.payment": ConfirmPayment,
  "commit.stock": CommitStock,
} as const satisfies Record<MicroserviceCommand, Type>;

export type PayloadByCommand<Command extends MicroserviceCommand> = (typeof PayloadByCommand)[Command]["inferIn"];
