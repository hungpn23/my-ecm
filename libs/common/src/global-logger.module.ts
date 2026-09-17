import type { DynamicModule } from "@nestjs/common";
import { LoggerModule, type Params } from "nestjs-pino";
import { v7 } from "uuid";
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
        autoLogging: false,
        quietReqLogger: true,
        quietResLogger: true,
        genReqId: (req) => req.headers["x-request-id"] ?? v7(),
      },
      microservice: true,
    };

    return {
      module: GlobalLoggerModule,
      imports: [LoggerModule.forRoot(deepMerge(defaultParams, params))],
    };
  }
}
