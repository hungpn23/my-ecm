import { ArktypeValidationPipe } from "@libs/common";
import { type AppConfig, appConfig, ConfigModule, LoggerModule } from "@libs/core";
import { Module, StandardSchemaSerializerInterceptor } from "@nestjs/common";
import { APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { createObserveModule } from "@nestjs/observe";

import { UserModule } from "./module/user/user.module";

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ObserveModule.forRootAsync({
      inject: [appConfig.KEY],
      useFactory: (config: AppConfig) => ({
        appKey: config.OBSERVE_APP_KEY,
        appSecret: config.OBSERVE_APP_SECRET,
        serviceId: config.APP_NAME,
        debug: config.OBSERVE_ENABLE_DEBUG,
      }),
    }),
    ConfigModule.forRoot(),
    LoggerModule.forRoot(),
    UserModule,
  ],
  providers: [
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
