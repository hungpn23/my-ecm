import type { DynamicModule } from "@nestjs/common";
import { createObserveModule } from "@nestjs/observe";

import { type AppConfig, appConfig } from "#internal/config/app.config";

const { ObserveModule: NestObserveModule, ObserveInstrument } = createObserveModule();

export { ObserveInstrument };

export class ObserveModule {
  static forRoot(): DynamicModule {
    return {
      module: ObserveModule,
      imports: [
        NestObserveModule.forRootAsync({
          inject: [appConfig.KEY],
          useFactory: (config: AppConfig) => ({
            appKey: config.observeAppKey,
            appSecret: config.observeAppSecret,
            serviceId: config.appName,
            debug: config.observeEnableDebug,
          }),
        }),
      ],
    };
  }
}
