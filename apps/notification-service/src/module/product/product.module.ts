import { Module } from "@nestjs/common";
import { ProductConsumer } from "./product.consumer";

@Module({
  controllers: [ProductConsumer],
})
export class ProductModule {}
