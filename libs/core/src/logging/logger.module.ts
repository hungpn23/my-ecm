import { deepMerge } from "@libs/common";
import type { DynamicModule } from "@nestjs/common";
import { LoggerModule as RootLoggerModule, type Params } from "nestjs-pino";
import { v7 } from "uuid";

export class LoggerModule {
  static forRoot(params?: Params): DynamicModule {
    const defaultParams: Params = {
      pinoHttp: {
        level: "debug",
        messageKey: "msg",
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
      module: LoggerModule,
      imports: [RootLoggerModule.forRoot(deepMerge(defaultParams, params))],
    };
  }
}
