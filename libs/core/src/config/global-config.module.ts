import { deepMerge } from "@libs/common";
import type { DynamicModule } from "@nestjs/common";
import { ConfigModule, type ConfigModuleOptions } from "@nestjs/config";
import { appConfig } from "./app.config";

export class GlobalConfigModule {
  static forRoot(options?: ConfigModuleOptions): DynamicModule {
    const defaultOptions: ConfigModuleOptions = {
      isGlobal: true,
      expandVariables: true,
      load: [appConfig],
    };

    return {
      module: GlobalConfigModule,
      imports: [ConfigModule.forRoot(deepMerge(defaultOptions, options))],
    };
  }
}
