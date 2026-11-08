import type { GetProductsByIds, Product } from "@libs/contract";
import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";

import { ProductEntity } from "#internal/database/entity/index";

@Injectable()
export class ProductRpcService {
  constructor(private readonly em: EntityManager) {}

  async findByIds({ productIds }: GetProductsByIds): Promise<Product[]> {
    const em = this.em.fork();
    const products = await em.find(ProductEntity, { id: { $in: productIds } }, { populate: ["category"] });

    return products.map((product) => product.toResponse());
  }
}
