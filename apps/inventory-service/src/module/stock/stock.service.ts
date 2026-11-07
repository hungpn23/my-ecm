import type { Availability, Stock, UpdateStock, Uuid } from "@libs/contract";
import { ShopContext } from "@libs/core";
import { LockMode } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { BadRequestException, Injectable } from "@nestjs/common";

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

  async update(productId: Uuid, { onHand }: UpdateStock): Promise<Stock> {
    return await this.em.transactional(async (em) => {
      const stock = await em.findOneOrFail(
        StockEntity,
        { productId, shopId: this.shopContext.shopId },
        { exclude: ["reservations"], lockMode: LockMode.PESSIMISTIC_WRITE },
      );

      if (onHand < stock.reserved) throw new BadRequestException("onHand cannot be less than reserved stock");

      stock.onHand = onHand;
      await em.flush();

      return stock.toResponse();
    });
  }
}
