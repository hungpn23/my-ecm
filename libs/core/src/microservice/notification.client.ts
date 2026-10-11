import { Injectable } from "@nestjs/common";
import type { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import { InjectMicroserviceClient } from "./microservice.decorator";
import type { MicroserviceEvent } from "./microservice.schema";
import { PayloadByEvent } from "./payload-by-event";

@Injectable()
export class NotificationClient {
  constructor(
    @InjectMicroserviceClient("NOTIFICATION_SERVICE") private readonly client: ClientProxy,
  ) {}

  async emit<Event extends MicroserviceEvent>(
    event: Event,
    payload: PayloadByEvent[NoInfer<Event>],
  ): Promise<void> {
    const validated = PayloadByEvent[event].assert(payload);

    return await lastValueFrom(this.client.emit(event, validated));
  }
}
