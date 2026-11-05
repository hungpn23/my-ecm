import { Endpoint } from "@libs/common";
import { Stock, Uuid } from "@libs/contract";
import { Can } from "@nestjs/authorization";
import { Controller, Param } from "@nestjs/common";

import { StockPolicy } from "./stock.policy";
import { StockService } from "./stock.service";

@Controller("stocks")
export class StockController {
  constructor(private readonly stock: StockService) {}

  @Can(StockPolicy, "view")
  @Endpoint("GET", { path: ":productId", response: Stock })
  async findOne(@Param("productId", { schema: Uuid }) productId: Uuid): Promise<Stock> {
    return await this.stock.findOne(productId);
  }
}
