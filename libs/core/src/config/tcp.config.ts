import arkenv, { type } from "@arkenv/core";
import { ServiceName } from "@libs/contract";
import { type ConfigType, registerAs } from "@nestjs/config";

export const tcpConfig = registerAs("tcp", () => {
  const env = arkenv({
    IDENTITY_SERVICE_TCP_HOST: type("string.host").or(ServiceName),
    IDENTITY_SERVICE_TCP_PORT: "number.port",
    PRODUCT_SERVICE_TCP_HOST: type("string.host").or(ServiceName),
    PRODUCT_SERVICE_TCP_PORT: "number.port",
    NOTIFICATION_SERVICE_TCP_HOST: type("string.host").or(ServiceName),
    NOTIFICATION_SERVICE_TCP_PORT: "number.port",
    ORDER_SERVICE_TCP_HOST: type("string.host").or(ServiceName),
    ORDER_SERVICE_TCP_PORT: "number.port",
    INVENTORY_SERVICE_TCP_HOST: type("string.host").or(ServiceName),
    INVENTORY_SERVICE_TCP_PORT: "number.port",
    PAYMENT_SERVICE_TCP_HOST: type("string.host").or(ServiceName),
    PAYMENT_SERVICE_TCP_PORT: "number.port",
    SHIPPING_SERVICE_TCP_HOST: type("string.host").or(ServiceName),
    SHIPPING_SERVICE_TCP_PORT: "number.port",
  });

  return {
    identityServiceTcpHost: env.IDENTITY_SERVICE_TCP_HOST,
    identityServiceTcpPort: env.IDENTITY_SERVICE_TCP_PORT,
    productServiceTcpHost: env.PRODUCT_SERVICE_TCP_HOST,
    productServiceTcpPort: env.PRODUCT_SERVICE_TCP_PORT,
    notificationServiceTcpHost: env.NOTIFICATION_SERVICE_TCP_HOST,
    notificationServiceTcpPort: env.NOTIFICATION_SERVICE_TCP_PORT,
    orderServiceTcpHost: env.ORDER_SERVICE_TCP_HOST,
    orderServiceTcpPort: env.ORDER_SERVICE_TCP_PORT,
    inventoryServiceTcpHost: env.INVENTORY_SERVICE_TCP_HOST,
    inventoryServiceTcpPort: env.INVENTORY_SERVICE_TCP_PORT,
    paymentServiceTcpHost: env.PAYMENT_SERVICE_TCP_HOST,
    paymentServiceTcpPort: env.PAYMENT_SERVICE_TCP_PORT,
    shippingServiceTcpHost: env.SHIPPING_SERVICE_TCP_HOST,
    shippingServiceTcpPort: env.SHIPPING_SERVICE_TCP_PORT,
  };
});

export type TcpConfig = ConfigType<typeof tcpConfig>;
