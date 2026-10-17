import { SellerModule } from "@libs/core";
import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";

@Module({
  imports: [SellerModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
