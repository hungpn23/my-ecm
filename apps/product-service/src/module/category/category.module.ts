import { Module } from "@nestjs/common";
import { CategoryController } from "./category.controller";
import { CategoryPolicy } from "./category.policy";
import { CategoryService } from "./category.service";

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryPolicy],
})
export class CategoryModule {}
