import { Injectable } from "@nestjs/common";
import type { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import { InjectMicroserviceClient } from "./microservice.decorator";
import type { MicroserviceCommand } from "./microservice.schema";
import { PayloadByCommand } from "./payload-by-command";
import { ResponseByCommand } from "./response-by-command";

@Injectable()
export class IdentityClient {
  constructor(@InjectMicroserviceClient("IDENTITY_SERVICE") private readonly client: ClientProxy) {}

  async send<Command extends MicroserviceCommand>(
    command: Command,
    payload: PayloadByCommand[NoInfer<Command>],
  ) {
    const validated = PayloadByCommand[command].assert(payload);

    const raw = await lastValueFrom(
      this.client.send<ResponseByCommand[NoInfer<Command>]>(command, validated),
    );

    return ResponseByCommand[command].assert(raw);
  }
}
