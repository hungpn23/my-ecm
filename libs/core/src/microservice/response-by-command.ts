import {
  AddressRpc,
  NullableReservationRpc,
  PaymentRpc,
  ProductsRpc,
  ProductStock,
  ReservationRpc,
  UserRpc,
} from "@libs/contract";
import type { Type } from "arktype";

import type { MicroserviceCommand } from "./microservice.rpc-schema";

export const ResponseByCommand = {
  "get.user.by-id": UserRpc,
  "get.address.by-id": AddressRpc,
  "get.products.by-ids": ProductsRpc,
  "create.stock": ProductStock,
  "reserve.stock": ReservationRpc,
  "get.reservation.by-checkout-id": NullableReservationRpc,
  "create.payment": PaymentRpc,
  "confirm.payment": PaymentRpc,
  "commit.stock": ReservationRpc,
} as const satisfies Record<MicroserviceCommand, Type>;

export type ResponseByCommand = {
  [Command in MicroserviceCommand]: (typeof ResponseByCommand)[Command]["inferIn"];
};
