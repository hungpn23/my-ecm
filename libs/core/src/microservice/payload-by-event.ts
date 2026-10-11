import { UserCreatedPayload } from "@libs/contract";
import type { Type } from "arktype";
import type { MicroserviceEvent } from "./microservice.schema";

export const PayloadByEvent = {
  "user.created": UserCreatedPayload,
} as const satisfies Record<MicroserviceEvent, Type>;

export type PayloadByEvent = {
  [Event in MicroserviceEvent]: (typeof PayloadByEvent)[Event]["inferIn"];
};
