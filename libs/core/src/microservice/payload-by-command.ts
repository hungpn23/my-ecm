import {
  CommitStock,
  ConfirmPayment,
  CreatePaymentPayload,
  CreateStock,
  GetAddressById,
  GetProductsByIds,
  GetReservationByCheckoutId,
  GetUserByIdPayload,
  ReserveStock,
} from "@libs/contract";
import type { Type } from "arktype";

import type { MicroserviceCommand } from "./microservice.rpc-schema";

export const PayloadByCommand = {
  "get.user.by-id": GetUserByIdPayload,
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
