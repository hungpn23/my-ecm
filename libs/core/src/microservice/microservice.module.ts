import type { DynamicModule } from "@nestjs/common";
import { ClientsModule, type ClientsProviderAsyncOptions, Transport } from "@nestjs/microservices";

import { ConfigModule } from "#internal/config/config.module";
import { type TcpConfig, tcpConfig } from "#internal/config/tcp.config";

import { IdentityClient } from "./client/identity.client";
import { NotificationClient } from "./client/notification.client";
import { ProductClient } from "./client/product.client";
import type { MicroserviceClient } from "./microservice.schema";

export class MicroserviceModule {
  static registerAsync(...clients: MicroserviceClient[]): DynamicModule {
    const clientRegistry = {
      IDENTITY_SERVICE: IdentityClient,
      NOTIFICATION_SERVICE: NotificationClient,
      PRODUCT_SERVICE: ProductClient,
    } as const;

    const providers = clients.map((client) => clientRegistry[client]);

    const options = clients.map((client) => ({
      name: client,
      imports: [ConfigModule.forFeatures(tcpConfig)],
      inject: [tcpConfig.KEY],
      useFactory: (config: TcpConfig) => ({
        transport: Transport.TCP,
        options: {
          host: config[`${client}_TCP_HOST`],
          port: config[`${client}_TCP_PORT`],
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
