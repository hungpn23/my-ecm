import { type } from "arktype";

export const MICROSERVICE_EVENTS = ["user.created"] as const;
export const MicroserviceEvent = type.enumerated(...MICROSERVICE_EVENTS);
export type MicroserviceEvent = typeof MicroserviceEvent.infer;
