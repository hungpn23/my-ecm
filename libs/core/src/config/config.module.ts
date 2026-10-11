import { deepMerge } from "@libs/common";
import type { DynamicModule } from "@nestjs/common";
import {
  ConfigModule as NestConfigModule,
  type ConfigFactory,
  type ConfigModuleOptions,
} from "@nestjs/config";
import { appConfig } from "./app.config";
import { tcpConfig } from "./tcp.config";

export class ConfigModule {
  static forRoot(options?: ConfigModuleOptions): DynamicModule {
    const defaultOptions: ConfigModuleOptions = {
      isGlobal: true,
      expandVariables: true,
      load: [appConfig, tcpConfig],
    };

    return {
      module: ConfigModule,
      imports: [NestConfigModule.forRoot(deepMerge(defaultOptions, options))],
    };
  }

  static forFeatures(...configs: ConfigFactory[]): DynamicModule {
    const imports = configs.map((config) => NestConfigModule.forFeature(config));

    return {
      module: ConfigModule,
      imports,
      exports: imports,
    };
  }
}
