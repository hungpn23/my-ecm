import { SellerModule } from "@libs/core";
import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductPolicy } from "./product.policy";
import { ProductService } from "./product.service";

@Module({
  imports: [SellerModule],
  controllers: [ProductController],
  providers: [ProductService, ProductPolicy],
})
export class ProductModule {}
