import { Injectable } from "@nestjs/common";
import type { ClientProxy } from "@nestjs/microservices";
import { InjectMicroserviceClient } from "./microservice.decorator";

@Injectable()
export class ProductClient {
  constructor(@InjectMicroserviceClient("PRODUCT_SERVICE") private readonly client: ClientProxy) {}
}
