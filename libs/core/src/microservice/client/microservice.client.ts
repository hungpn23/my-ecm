import { ServerError } from "@libs/contract";
import { HttpException } from "@nestjs/common";
import type { ClientProxy } from "@nestjs/microservices";
import { catchError, lastValueFrom, timeout } from "rxjs";

import { ContractByCommand, type PayloadByCommand, type ResponseByCommand } from "../microservice.contract";
import type { MicroserviceCommand, MicroserviceEvent } from "../microservice.rpc-schema";
import { PayloadByEvent } from "../payload-by-event";

export abstract class AbstractMicroserviceClient {
  constructor(protected readonly client: ClientProxy) {}

  async send<Command extends MicroserviceCommand>(
    command: Command,
    payload: PayloadByCommand<Command>,
    timeoutMs = 3000,
  ): Promise<ResponseByCommand<Command>> {
    const [payloadSchema, responseSchema] = ContractByCommand[command];
    const validated = payloadSchema.assert(payload);

    const response$ = this.client.send<unknown>(command, validated).pipe(
      timeout(timeoutMs),
      catchError((error: unknown) => {
        if (ServerError.allows(error)) {
          const { statusCode, message, errorCode } = error;
          throw new HttpException({ message }, statusCode, { errorCode });
        }

        throw error;
      }),
    );
    const response = await lastValueFrom(response$);

    return responseSchema.assert(response);
  }

  async emit<Event extends MicroserviceEvent>(event: Event, payload: PayloadByEvent<Event>): Promise<void> {
    const validated = PayloadByEvent[event].assert(payload);

    return await lastValueFrom(this.client.emit(event, validated));
  }
}
