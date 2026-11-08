import {
  NullableAddressFromRpc,
  NullableReservationFromRpc,
  NullableUserFromRpc,
  PaymentFromRpc,
  ProductsFromRpc,
  ProductStock,
  ReservationFromRpc,
} from "@libs/contract";
import type { Type } from "arktype";

import type { MicroserviceCommand } from "./microservice.rpc-schema";

export const ResponseByCommand = {
  "get.user.by-id": NullableUserFromRpc,
  "get.address.by-id": NullableAddressFromRpc,
  "get.products.by-ids": ProductsFromRpc,
  "create.stock": ProductStock,
  "reserve.stock": ReservationFromRpc,
  "get.reservation.by-checkout-id": NullableReservationFromRpc,
  "create.payment": PaymentFromRpc,
  "confirm.payment": PaymentFromRpc,
  "commit.stock": ReservationFromRpc,
} as const satisfies Record<MicroserviceCommand, Type>;

export type ResponseByCommand<Command extends MicroserviceCommand> = (typeof ResponseByCommand)[Command]["infer"];
