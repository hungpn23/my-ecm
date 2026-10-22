import type { CreateShop, ShopDetail } from "@libs/contract";
import { EntityManager } from "@mikro-orm/postgresql";
import { AuthenticationContext } from "@nestjs/authentication";
import { Injectable } from "@nestjs/common";

import { ShopEntity, UserEntity } from "#internal/database/entity/index";

@Injectable()
export class ShopService {
  constructor(
    private readonly em: EntityManager,
    private readonly authContext: AuthenticationContext,
  ) {}

  async create(body: CreateShop): Promise<ShopDetail> {
    return await this.em.transactional(async (em) => {
      const owner = await em.findOneOrFail(UserEntity, {
        id: this.authContext.requireUser().id,
      });

      const newShop = em.create(ShopEntity, {
        ...body,
        description: body.description,
        owner,
      });

      newShop.addMember(owner, "OWNER");

      const shop = await em.populate(newShop, ["owner", "description"]);
      return shop.toDetailResponse();
    });
  }
}
