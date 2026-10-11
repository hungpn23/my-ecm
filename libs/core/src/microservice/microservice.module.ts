import type { DynamicModule } from "@nestjs/common";
import { ClientsModule, Transport, type ClientsProviderAsyncOptions } from "@nestjs/microservices";
import { ConfigModule, tcpConfig, type TcpConfig } from "../config";
import { IdentityClient } from "./identity.client";
import type { MicroserviceClient } from "./microservice.schema";
import { NotificationClient } from "./notification.client";
import { ProductClient } from "./product.client";

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
