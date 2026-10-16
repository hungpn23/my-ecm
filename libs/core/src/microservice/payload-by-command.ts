import { GetUserByIdPayload } from "@libs/contract";
import type { Type } from "arktype";
import type { MicroserviceCommand } from "./microservice.schema";

export const PayloadByCommand = {
  "get.user.by-id": GetUserByIdPayload,
} as const satisfies Record<MicroserviceCommand, Type>;

export type PayloadByCommand = {
  [Command in MicroserviceCommand]: (typeof PayloadByCommand)[Command]["inferIn"];
};
