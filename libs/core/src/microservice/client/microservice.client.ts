import { RpcError } from "@libs/contract";
import { HttpException } from "@nestjs/common";
import type { ClientProxy } from "@nestjs/microservices";
import { catchError, lastValueFrom, timeout } from "rxjs";

import type { MicroserviceCommand, MicroserviceEvent } from "../microservice.rpc-schema";
import { PayloadByCommand } from "../payload-by-command";
import { PayloadByEvent } from "../payload-by-event";
import { ResponseByCommand } from "../response-by-command";

export abstract class AbstractMicroserviceClient {
  constructor(protected readonly client: ClientProxy) {}

  async send<Command extends MicroserviceCommand>(
    command: Command,
    payload: PayloadByCommand[NoInfer<Command>],
    timeoutMs = 3000,
  ): Promise<(typeof ResponseByCommand)[Command]["infer"]> {
    const validated = PayloadByCommand[command].assert(payload);

    const response$ = this.client.send<ResponseByCommand[NoInfer<Command>]>(command, validated).pipe(
      timeout(timeoutMs),
      catchError((e: unknown) => {
        if (RpcError.allows(e)) throw new HttpException(e, e.statusCode);
        throw e;
      }),
    );
    const response = await lastValueFrom(response$);

    return ResponseByCommand[command].assert(response);
  }

  async emit<Event extends MicroserviceEvent>(event: Event, payload: PayloadByEvent[NoInfer<Event>]): Promise<void> {
    const validated = PayloadByEvent[event].assert(payload);

    return await lastValueFrom(this.client.emit(event, validated));
  }
}
