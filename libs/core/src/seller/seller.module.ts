import { Module } from "@nestjs/common";
import { SellerContext } from "./seller.context";

@Module({
  providers: [SellerContext],
  exports: [SellerContext],
})
export class SellerModule {}
