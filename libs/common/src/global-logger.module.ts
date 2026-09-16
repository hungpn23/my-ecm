import type { DynamicModule } from "@nestjs/common";
import { LoggerModule, type Params } from "nestjs-pino";
import { deepMerge } from "./deep-merge";

export class GlobalLoggerModule {
  static forRoot(params?: Params): DynamicModule {
    const defaultParams: Params = {
      pinoHttp: {
        level: "debug",
        transport: {
          target: "pino-pretty",
          options: {
            ignore: "req.headers,res.headers,remoteAddress,remotePort",
          },
        },
      },
    };

    return {
      module: GlobalLoggerModule,
      imports: [LoggerModule.forRoot(deepMerge(defaultParams, params))],
    };
  }
}
