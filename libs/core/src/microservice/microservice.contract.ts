import {
  CommitStock,
  ConfirmPayment,
  CreatePaymentPayload,
  CreateStock,
  GetAddressById,
  GetProductsByIds,
  GetReservationByCheckoutId,
  GetUserById,
  NullableAddressFromRpc,
  NullableReservationFromRpc,
  NullableUserFromRpc,
  PaymentFromRpc,
  ProductsFromRpc,
  ProductStock,
  ReservationFromRpc,
  ReserveStock,
} from "@libs/contract";
import type { Type } from "arktype";

import type { MicroserviceCommand } from "./microservice.rpc-schema";

export const ContractByCommand = {
  "get.user.by-id": [GetUserById, NullableUserFromRpc],
  "get.address.by-id": [GetAddressById, NullableAddressFromRpc],
  "get.products.by-ids": [GetProductsByIds, ProductsFromRpc],
  "create.stock": [CreateStock, ProductStock],
  "reserve.stock": [ReserveStock, ReservationFromRpc],
  "get.reservation.by-checkout-id": [GetReservationByCheckoutId, NullableReservationFromRpc],
  "create.payment": [CreatePaymentPayload, PaymentFromRpc],
  "confirm.payment": [ConfirmPayment, PaymentFromRpc],
  "commit.stock": [CommitStock, ReservationFromRpc],
} as const satisfies Record<MicroserviceCommand, readonly [Type, Type]>;

export type PayloadByCommand<Command extends MicroserviceCommand> = (typeof ContractByCommand)[Command][0]["inferIn"];
export type ResponseByCommand<Command extends MicroserviceCommand> = (typeof ContractByCommand)[Command][1]["infer"];
