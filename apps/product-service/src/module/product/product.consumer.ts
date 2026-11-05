import { GetProductsByIds, type Product } from "@libs/contract";
import type { MicroserviceCommand } from "@libs/core";
import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { ProductRpcService } from "./product.rpc-service";

@Controller()
export class ProductConsumer {
  constructor(private readonly product: ProductRpcService) {}

  @MessagePattern<MicroserviceCommand>("get.products.by-ids")
  async getProducts(@Payload({ schema: GetProductsByIds }) payload: GetProductsByIds): Promise<Product[]> {
    return await this.product.findByIds(payload);
  }
}
