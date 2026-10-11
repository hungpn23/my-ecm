import { type } from "arktype";

export const MICROSERVICE_CLIENT = {
  IDENTITY: "IDENTITY_SERVICE",
  NOTIFICATION: "NOTIFICATION_SERVICE",
  PRODUCT: "PRODUCT_SERVICE",
} as const;
export const MicroserviceClient = type.enumerated(...Object.values(MICROSERVICE_CLIENT));
export type MicroserviceClient = typeof MicroserviceClient.infer;

export const MICROSERVICE_EVENTS = ["user.created"] as const;
export const MicroserviceEvent = type.enumerated(...MICROSERVICE_EVENTS);
export type MicroserviceEvent = typeof MicroserviceEvent.infer;

export const MICROSERVICE_COMMANDS = ["get.user"] as const;
export const MicroserviceCommand = type.enumerated(...MICROSERVICE_COMMANDS);
export type MicroserviceCommand = typeof MicroserviceCommand.infer;
