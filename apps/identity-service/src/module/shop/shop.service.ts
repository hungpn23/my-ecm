import { Shop, User } from "#internal/database/entity/index";
import type { CreateShop, CreateShopResponse } from "@libs/contract";
import { EntityManager } from "@mikro-orm/postgresql";
import { AuthenticationContext } from "@nestjs/authentication";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class ShopService {
  constructor(
    private readonly em: EntityManager,
    private readonly authCtx: AuthenticationContext,
  ) {}

  async create(body: CreateShop): Promise<CreateShopResponse> {
    return await this.em.transactional(async (em) => {
      const user = await em.findOne(User, { id: this.authCtx.requireUser().id });
      if (!user) throw new NotFoundException();

      const newShop = em.create(Shop, {
        ...body,
        description: body.description,
        owner: user,
      });

      user.joinShop(newShop, "OWNER");

      const shop = await em.populate(newShop, ["owner", "description"]);
      return shop.toDetailResponse();
    });
  }
}
