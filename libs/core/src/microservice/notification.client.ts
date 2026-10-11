import { Injectable } from "@nestjs/common";
import type { ClientProxy } from "@nestjs/microservices";
import { InjectMicroserviceClient } from "./microservice.decorator";
import type { MicroserviceEvent } from "./microservice.event";

@Injectable()
export class NotificationClient {
  constructor(
    @InjectMicroserviceClient("NOTIFICATION_SERVICE") private readonly client: ClientProxy,
  ) {}

  emit(event: MicroserviceEvent, payload: any) {
    this.client.emit(event, payload);
  }
}
