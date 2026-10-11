import { Injectable } from "@nestjs/common";
import type { ClientProxy } from "@nestjs/microservices";
import { InjectMicroserviceClient } from "./microservice.decorator";

@Injectable()
export class IdentityClient {
  constructor(@InjectMicroserviceClient("IDENTITY_SERVICE") private readonly client: ClientProxy) {}
}
