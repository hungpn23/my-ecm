import { ShopContextModule } from "@libs/core";
import { Module } from "@nestjs/common";

import { ShopController } from "./shop.controller";
import { ShopPolicy } from "./shop.policy";
import { ShopService } from "./shop.service";

@Module({
  imports: [ShopContextModule],
  controllers: [ShopController],
  providers: [ShopService, ShopPolicy],
})
export class ShopModule {}
