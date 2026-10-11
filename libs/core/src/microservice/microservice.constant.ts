import { type } from "arktype";

export const MICROSERVICE_CLIENT = {
  IDENTITY: "IDENTITY_SERVICE",
  NOTIFICATION: "NOTIFICATION_SERVICE",
  PRODUCT: "PRODUCT_SERVICE",
} as const;
export const MicroserviceClient = type.enumerated(...Object.values(MICROSERVICE_CLIENT));
export type MicroserviceClient = typeof MicroserviceClient.infer;
