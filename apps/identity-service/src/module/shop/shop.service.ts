import { Shop, User } from "#internal/database/entity/index";
import { AuthService } from "#internal/module/auth/auth.service";
import type { AuthenticatedUser } from "@libs/core";
import { Transactional } from "@mikro-orm/decorators/legacy";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Injectable, NotFoundException } from "@nestjs/common";
import type { CreateShop, CreateShopResponse } from "./shop.schema";

@Injectable()
export class ShopService {
  constructor(
    private readonly em: EntityManager,
    private readonly authService: AuthService,
    @InjectRepository(Shop)
    private readonly shopRepo: EntityRepository<Shop>,
    @InjectRepository(User)
    private readonly userRepo: EntityRepository<User>,
  ) {}

  @Transactional()
  async create(userClaim: AuthenticatedUser, body: CreateShop): Promise<CreateShopResponse> {
    const user = await this.userRepo.findOne({ id: userClaim.userId });
    if (!user) throw new NotFoundException();

    const newShop = this.shopRepo.create({
      ...body,
      description: body.description,
      owner: user,
    });

    user.joinShop(newShop, "OWNER");

    const shop = await this.em.populate(newShop, ["owner", "description"]);
    const response = shop.toDetailResponse();
    const tokens = await this.authService.generateToken({
      userId: userClaim.userId,
      role: userClaim.role,
      sessionId: userClaim.sessionId,
      shopId: shop.id,
      shopRole: "OWNER",
    });

    return { ...response, ...tokens };
  }
}
