import type { DynamicModule } from "@nestjs/common";
import { createObserveModule } from "@nestjs/observe";

import { type AppConfig, appConfig } from "#internal/config/app.config";
import { ConfigModule } from "#internal/config/config.module";
import { type ObserveConfig, observeConfig } from "#internal/config/observe.config";

const { ObserveModule: NestObserveModule, ObserveInstrument } = createObserveModule();

export { ObserveInstrument };

export class ObserveModule {
  static forRoot(): DynamicModule {
    return {
      module: ObserveModule,
      imports: [
        NestObserveModule.forRootAsync({
          imports: [ConfigModule.forFeatures(observeConfig)],
          inject: [appConfig.KEY, observeConfig.KEY],
          useFactory: (appConf: AppConfig, observeConf: ObserveConfig) => ({
            appKey: observeConf.observeAppKey,
            appSecret: observeConf.observeAppSecret,
            serviceId: appConf.appName,
            debug: observeConf.observeEnableDebug,
          }),
        }),
      ],
    };
  }
}
