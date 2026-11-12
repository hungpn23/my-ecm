import { ShopContextModule } from "@libs/core";
import { Module } from "@nestjs/common";

import { StockConsumer } from "./stock.consumer";
import { StockController } from "./stock.controller";
import { StockPolicy } from "./stock.policy";
import { StockRpcService } from "./stock.rpc-service";
import { StockService } from "./stock.service";

@Module({
  imports: [ShopContextModule],
  controllers: [StockController, StockConsumer],
  providers: [StockService, StockPolicy, StockRpcService],
})
export class StockModule {}
