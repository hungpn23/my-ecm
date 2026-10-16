import { RpcError } from "@libs/contract";
import { HttpException, Injectable } from "@nestjs/common";
import type { ClientProxy } from "@nestjs/microservices";
import { catchError, lastValueFrom, timeout } from "rxjs";
import { InjectMicroserviceClient } from "./microservice.decorator";
import type { MicroserviceCommand, MicroserviceEvent } from "./microservice.schema";
import { PayloadByCommand } from "./payload-by-command";
import { PayloadByEvent } from "./payload-by-event";
import { ResponseByCommand } from "./response-by-command";

abstract class MicroserviceClient {
  constructor(protected readonly client: ClientProxy) {}

  async send<Command extends MicroserviceCommand>(
    command: Command,
    payload: PayloadByCommand[NoInfer<Command>],
    timeoutMs: number = 3000,
  ) {
    const validated = PayloadByCommand[command].assert(payload);

    const response$ = this.client
      .send<ResponseByCommand[NoInfer<Command>]>(command, validated)
      .pipe(
        timeout(timeoutMs),
        catchError((e: RpcError) => {
          if (RpcError.allows(e)) throw new HttpException(e, e.statusCode);
          throw e;
        }),
      );
    const response = await lastValueFrom(response$);

    return ResponseByCommand[command].assert(response);
  }

  async emit<Event extends MicroserviceEvent>(
    event: Event,
    payload: PayloadByEvent[NoInfer<Event>],
  ): Promise<void> {
    const validated = PayloadByEvent[event].assert(payload);

    return await lastValueFrom(this.client.emit(event, validated));
  }
}

@Injectable()
export class IdentityClient extends MicroserviceClient {
  constructor(@InjectMicroserviceClient("IDENTITY_SERVICE") client: ClientProxy) {
    super(client);
  }
}

@Injectable()
export class NotificationClient extends MicroserviceClient {
  constructor(@InjectMicroserviceClient("NOTIFICATION_SERVICE") client: ClientProxy) {
    super(client);
  }
}

@Injectable()
export class ProductClient extends MicroserviceClient {
  constructor(@InjectMicroserviceClient("PRODUCT_SERVICE") client: ClientProxy) {
    super(client);
  }
}
