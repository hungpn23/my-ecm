import type { DynamicModule } from "@nestjs/common";
import { ConfigModule, type ConfigModuleOptions } from "@nestjs/config";
import { appConfig } from "./app.config";

export class BaseConfigModule {
  static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
    const { load = [], ...restOptions } = options;

    return {
      module: BaseConfigModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          expandVariables: true,
          load: [appConfig, ...load],
          ...restOptions,
        }),
      ],
    };
  }
}
