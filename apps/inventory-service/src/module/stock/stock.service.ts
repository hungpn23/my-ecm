import type { Availability, Stock, Uuid } from "@libs/contract";
import { ShopContext } from "@libs/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";

import { StockEntity } from "#internal/database/entity/index";

@Injectable()
export class StockService {
  constructor(
    private readonly em: EntityManager,
    private readonly shopContext: ShopContext,
  ) {}

  async findOne(productId: Uuid): Promise<Stock> {
    const stock = await this.em.findOneOrFail(
      StockEntity,
      { productId, shopId: this.shopContext.shopId },
      { exclude: ["reservations"] },
    );

    return stock.toResponse();
  }

  async findAvailability(productId: Uuid): Promise<Availability> {
    const stock = await this.em.findOneOrFail(StockEntity, { productId }, { exclude: ["shopId", "reservations"] });

    return stock.toAvailabilityResponse();
  }
}
