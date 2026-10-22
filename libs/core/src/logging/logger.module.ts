import { deepMerge, X_REQUEST_ID } from "@libs/common";
import type { DynamicModule } from "@nestjs/common";
import { LoggerModule as PinoLoggerModule, type Params } from "nestjs-pino";
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
        genReqId: (req, res) => {
          const id = req.headers[X_REQUEST_ID] ?? v7();
          res.setHeader(X_REQUEST_ID, id);
          return id;
        },
      },
      microservice: {
        autoLogging: false,
        quietRpcLogger: true,
        genReqId: (_ctx) => {
          return (
            // ctx.switchToRpc().getContext<KafkaContext>().getMessage().headers?.[X_REQUEST_ID] ??
            v7()
          );
        },
      },
    };

    return {
      module: LoggerModule,
      imports: [PinoLoggerModule.forRoot(deepMerge(defaultParams, params))],
    };
  }
}
