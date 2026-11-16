import {
  CommitStock,
  ConfirmPayment,
  CreatePayment,
  CreateStock,
  GetAddressById,
  GetProductsByIds,
  GetReservationByCheckoutId,
  GetUserById,
  NullableAddress,
  NullableReservation,
  NullableUser,
  Payment,
  Products,
  ProductStock,
  Reservation,
  ReserveStock,
} from "@libs/contract";
import type { Type } from "arktype";

import type { MicroserviceCommand } from "./microservice.rpc-schema";

export const ContractByCommand = {
  "get.user.by-id": [GetUserById, NullableUser],
  "get.address.by-id": [GetAddressById, NullableAddress],
  "get.products.by-ids": [GetProductsByIds, Products],
  "create.stock": [CreateStock, ProductStock],
  "reserve.stock": [ReserveStock, Reservation],
  "get.reservation.by-checkout-id": [GetReservationByCheckoutId, NullableReservation],
  "create.payment": [CreatePayment, Payment],
  "confirm.payment": [ConfirmPayment, Payment],
  "commit.stock": [CommitStock, Reservation],
} as const satisfies Record<MicroserviceCommand, readonly [Type, Type]>;

export type PayloadByCommand<Command extends MicroserviceCommand> = (typeof ContractByCommand)[Command][0]["inferIn"];
export type ResponseByCommand<Command extends MicroserviceCommand> = (typeof ContractByCommand)[Command][1]["infer"];
