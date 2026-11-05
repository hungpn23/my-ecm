import { ShopContextModule } from "@libs/core";
import { Module } from "@nestjs/common";

import { ProductConsumer } from "./product.consumer";
import { ProductController } from "./product.controller";
import { ProductPolicy } from "./product.policy";
import { ProductRpcService } from "./product.rpc-service";
import { ProductService } from "./product.service";

@Module({
  imports: [ShopContextModule],
  controllers: [ProductController, ProductConsumer],
  providers: [ProductService, ProductPolicy, ProductRpcService],
})
export class ProductModule {}
