import { TcpUserResponse } from "@libs/contract";
import type { Type } from "arktype";
import type { MicroserviceCommand } from "./microservice.schema";

export const ResponseByCommand = {
  "get.user": TcpUserResponse,
} as const satisfies Record<MicroserviceCommand, Type>;

export type ResponseByCommand = {
  [Command in MicroserviceCommand]: (typeof ResponseByCommand)[Command]["inferIn"];
};
