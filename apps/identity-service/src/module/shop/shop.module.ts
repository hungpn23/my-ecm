import { Shop, User } from "#internal/database/entity/index";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ShopController } from "./shop.controller";
import { ShopService } from "./shop.service";

@Module({
  imports: [MikroOrmModule.forFeature([Shop, User])],
  controllers: [ShopController],
  providers: [ShopService],
})
export class ShopModule {}
