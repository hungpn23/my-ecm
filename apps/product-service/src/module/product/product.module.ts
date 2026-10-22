import { ShopContextModule } from "@libs/core";
import { Module } from "@nestjs/common";

import { ProductController } from "./product.controller";
import { ProductPolicy } from "./product.policy";
import { ProductService } from "./product.service";

@Module({
  imports: [ShopContextModule],
  controllers: [ProductController],
  providers: [ProductService, ProductPolicy],
})
export class ProductModule {}
