import { Module } from "@nestjs/common";

import { ShopContext } from "./shop.context";

@Module({
  providers: [ShopContext],
  exports: [ShopContext],
})
export class ShopContextModule {}
