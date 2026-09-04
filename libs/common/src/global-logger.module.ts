import type { DynamicModule } from "@nestjs/common";
import { LoggerModule, type Params } from "nestjs-pino";
import { deepMerge } from "./deep-merge";

export class GlobalLoggerModule {
  static forRoot(options?: Params): DynamicModule {
    const defaultOptions: Params = {
      pinoHttp: {
        level: "debug",
        transport: {
          target: "pino-pretty",
          options: {
            customColors: "error:bgRed",
            ignore: "req.headers,res.headers,remoteAddress,remotePort",
          },
        },
      },
    };

    return {
      module: GlobalLoggerModule,
      imports: [LoggerModule.forRoot(deepMerge(defaultOptions, options))],
    };
  }
}
