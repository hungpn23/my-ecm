import type { DynamicModule } from "@nestjs/common";
import {
  ClientsModule,
  type ClientsProviderAsyncOptions,
  type TcpClientOptions,
  Transport,
} from "@nestjs/microservices";

import { ConfigModule } from "#internal/config/config.module";
import { type TcpConfig, tcpConfig } from "#internal/config/tcp.config";

import { IdentityClient } from "./client/identity.client";
import { InventoryClient } from "./client/inventory.client";
import { NotificationClient } from "./client/notification.client";
import { ProductClient } from "./client/product.client";
import type { MicroserviceClient } from "./microservice.rpc-schema";

export class MicroserviceModule {
  static registerAsync(...clients: MicroserviceClient[]): DynamicModule {
    const clientRegistry = {
      IDENTITY_SERVICE: IdentityClient,
      INVENTORY_SERVICE: InventoryClient,
      NOTIFICATION_SERVICE: NotificationClient,
      PRODUCT_SERVICE: ProductClient,
    } as const;

    const addresses = {
      IDENTITY_SERVICE: { host: "identityServiceTcpHost", port: "identityServiceTcpPort" },
      INVENTORY_SERVICE: { host: "inventoryServiceTcpHost", port: "inventoryServiceTcpPort" },
      NOTIFICATION_SERVICE: { host: "notificationServiceTcpHost", port: "notificationServiceTcpPort" },
      PRODUCT_SERVICE: { host: "productServiceTcpHost", port: "productServiceTcpPort" },
    } as const;

    const providers = clients.map((client) => clientRegistry[client]);

    const options = clients.map((client) => ({
      name: client,
      imports: [ConfigModule.forFeatures(tcpConfig)],
      inject: [tcpConfig.KEY],
      useFactory: (config: TcpConfig): TcpClientOptions => ({
        transport: Transport.TCP,
        options: {
          host: config[addresses[client].host],
          port: config[addresses[client].port],
        },
      }),
    })) satisfies ClientsProviderAsyncOptions[];

    return {
      module: MicroserviceModule,
      global: true,
      imports: [ClientsModule.registerAsync(options)],
      providers,
      exports: providers,
    };
  }
}
