import { ArktypeValidationPipe, MikroOrmExceptionFilter, RxjsExceptionFilter } from "@libs/common";
import { type AppConfig, appConfig, AuthModule, ConfigModule, DatabaseModule, LoggerModule } from "@libs/core";
import { Module, StandardSchemaSerializerInterceptor } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { createObserveModule } from "@nestjs/observe";

import { entities } from "#mikro-orm/generated";

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
    AuthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: RxjsExceptionFilter,
    },
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
