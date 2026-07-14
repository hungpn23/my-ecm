import { DynamicModule } from "@nestjs/common";
import { ConfigModule, ConfigModuleOptions } from "@nestjs/config";
import { appConfig } from "./app.config";

export class CommonConfigModule {
  static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
    const { load = [], ...restOptions } = options;

    return {
      module: CommonConfigModule,
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
