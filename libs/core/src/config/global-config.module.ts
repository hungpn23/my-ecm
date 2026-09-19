import { deepMerge } from "@libs/common";
import type { DynamicModule } from "@nestjs/common";
import { ConfigModule as RootConfigModule, type ConfigModuleOptions } from "@nestjs/config";
import { appConfig } from "./app.config";

export class ConfigModule {
  static forRoot(options?: ConfigModuleOptions): DynamicModule {
    const defaultOptions: ConfigModuleOptions = {
      isGlobal: true,
      expandVariables: true,
      load: [appConfig],
    };

    return {
      module: ConfigModule,
      imports: [RootConfigModule.forRoot(deepMerge(defaultOptions, options))],
    };
  }
}
