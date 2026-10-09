import { Shop, User } from "#internal/database/entity/index";
import type { CreateShop, CreateShopResponse } from "@libs/contract";
import { Transactional } from "@mikro-orm/decorators/legacy";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { AuthenticationContext } from "@nestjs/authentication";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class ShopService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Shop)
    private readonly shopRepo: EntityRepository<Shop>,
    @InjectRepository(User)
    private readonly userRepo: EntityRepository<User>,
    private readonly authCtx: AuthenticationContext,
  ) {}

  @Transactional()
  async create(body: CreateShop): Promise<CreateShopResponse> {
    const user = await this.userRepo.findOne({ id: this.authCtx.requireUser().id });
    if (!user) throw new NotFoundException();

    const newShop = this.shopRepo.create({
      ...body,
      description: body.description,
      owner: user,
    });

    user.joinShop(newShop, "OWNER");

    const shop = await this.em.populate(newShop, ["owner", "description"]);
    return shop.toDetailResponse();
  }
}
