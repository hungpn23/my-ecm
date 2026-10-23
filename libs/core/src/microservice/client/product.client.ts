import { Injectable } from "@nestjs/common";
import type { ClientProxy } from "@nestjs/microservices";

import { InjectMicroserviceClient } from "../microservice.decorator";
import { AbstractMicroserviceClient } from "./microservice.client";

@Injectable()
export class ProductClient extends AbstractMicroserviceClient {
  constructor(@InjectMicroserviceClient("PRODUCT_SERVICE") client: ClientProxy) {
    super(client);
  }
}
