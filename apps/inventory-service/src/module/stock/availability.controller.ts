import { Endpoint } from "@libs/common";
import { Availability, AvailabilityQuery } from "@libs/contract";
import { Controller, Query } from "@nestjs/common";

import { StockService } from "./stock.service";

@Controller("availability")
export class AvailabilityController {
  constructor(private readonly stock: StockService) {}

  @Endpoint("GET", { public: true, query: AvailabilityQuery, response: Availability })
  async findOne(@Query({ schema: AvailabilityQuery }) { productId }: AvailabilityQuery): Promise<Availability> {
    return await this.stock.findAvailability(productId);
  }
}
