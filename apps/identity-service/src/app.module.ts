import { ArktypeValidationPipe, MikroOrmExceptionFilter } from "@libs/common";
import { type AppConfig, appConfig, ConfigModule, DatabaseModule, LoggerModule, MicroserviceModule } from "@libs/core";
import { Module, StandardSchemaSerializerInterceptor } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { createObserveModule } from "@nestjs/observe";

import { entities } from "#mikro-orm/generated";

import { AddressModule } from "./module/address/address.module";
import { AuthModule } from "./module/auth/auth.module";
import { ShopModule } from "./module/shop/shop.module";
import { UserModule } from "./module/user/user.module";

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ObserveModule.forRootAsync({
      inject: [appConfig.KEY],
      useFactory: (config: AppConfig) => ({
        appKey: config.observeAppKey,
        appSecret: config.observeAppSecret,
        serviceId: config.appName,
        debug: config.observeEnableDebug,
      }),
    }),
    ConfigModule.forRoot(),
    DatabaseModule.forRoot(entities),
    LoggerModule.forRoot(),
    MicroserviceModule.registerAsync("NOTIFICATION_SERVICE"),
    AuthModule,
    AddressModule,
    ShopModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: MikroOrmExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ArktypeValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: StandardSchemaSerializerInterceptor,
    },
  ],
})
export class AppModule {}
