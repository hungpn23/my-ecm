import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { Category, Product } from "#internal/database/entity/index";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";

@Module({
  imports: [MikroOrmModule.forFeature([Category, Product])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
