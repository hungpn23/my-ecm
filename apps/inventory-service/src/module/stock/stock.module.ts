import { ShopContextModule } from "@libs/core";
import { Module } from "@nestjs/common";

import { AvailabilityController } from "./availability.controller";
import { StockController } from "./stock.controller";
import { StockPolicy } from "./stock.policy";
import { StockService } from "./stock.service";

@Module({
  imports: [ShopContextModule],
  controllers: [StockController, AvailabilityController],
  providers: [StockService, StockPolicy],
})
export class StockModule {}
