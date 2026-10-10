import { registerAs, type ConfigType } from "@nestjs/config";
import arkenv from "arkenv";

export const tcpConfig = registerAs("tcp", () =>
  arkenv({
    IDENTITY_SERVICE_TCP_HOST: "string.host",
    IDENTITY_SERVICE_TCP_PORT: "number.port",
    PRODUCT_SERVICE_TCP_HOST: "string.host",
    PRODUCT_SERVICE_TCP_PORT: "number.port",
    NOTIFICATION_SERVICE_TCP_HOST: "string.host",
    NOTIFICATION_SERVICE_TCP_PORT: "number.port",
  }),
);

export type TcpConfig = ConfigType<typeof tcpConfig>;
