import { NullableStockReservation, ProductsRpc, StockReservation, UserRpc } from "@libs/contract";
import type { Type } from "arktype";

import type { MicroserviceCommand } from "./microservice.rpc-schema";

export const ResponseByCommand = {
  "get.user.by-id": UserRpc,
  "get.products.by-ids": ProductsRpc,
  "reserve.stock": StockReservation,
  "get.reservation.by-checkout-id": NullableStockReservation,
} as const satisfies Record<MicroserviceCommand, Type>;

export type ResponseByCommand = {
  [Command in MicroserviceCommand]: (typeof ResponseByCommand)[Command]["inferIn"];
};
