import { GetProductsByIds, GetReservationByCheckoutId, GetUserByIdPayload, ReserveStock } from "@libs/contract";
import type { Type } from "arktype";

import type { MicroserviceCommand } from "./microservice.rpc-schema";

export const PayloadByCommand = {
  "get.user.by-id": GetUserByIdPayload,
  "get.products.by-ids": GetProductsByIds,
  "reserve.stock": ReserveStock,
  "get.reservation.by-checkout-id": GetReservationByCheckoutId,
} as const satisfies Record<MicroserviceCommand, Type>;

export type PayloadByCommand = {
  [Command in MicroserviceCommand]: (typeof PayloadByCommand)[Command]["inferIn"];
};
