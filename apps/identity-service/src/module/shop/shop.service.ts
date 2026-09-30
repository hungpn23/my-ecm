import { Shop, User } from "#internal/database/entity/index";
import { AuthService } from "#internal/module/auth/auth.service";
import { BaseService, type AuthenticatedUser } from "@libs/core";
import { Transactional } from "@mikro-orm/decorators/legacy";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository, wrap, type Loaded } from "@mikro-orm/postgresql";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import type {
  CreateShop,
  CreateShopResponse,
  ShopDetailResponse,
  ShopResponse,
} from "./shop.schema";

@Injectable()
export class ShopService extends BaseService<Shop> {
  constructor(
    private readonly em: EntityManager,
    private readonly authService: AuthService,
    @InjectRepository(Shop)
    private readonly shopRepo: EntityRepository<Shop>,
    @InjectRepository(User)
    private readonly userRepo: EntityRepository<User>,
  ) {
    super();
  }

  @Transactional()
  async create(userClaim: AuthenticatedUser, body: CreateShop): Promise<CreateShopResponse> {
    const user = await this.userRepo.findOne({ id: userClaim.userId });
    if (!user) throw new NotFoundException();
    if (user.shop) throw new ConflictException("You already belongs to a shop.");

    const newShop = this.shopRepo.create({
      ...body,
      description: body.description,
      owner: user,
    });

    this.userRepo.assign(user, { shopRole: "OWNER", shop: newShop });

    const shop = await this.em.populate(newShop, ["owner", "description"]);
    const response = this._toDetailResponse(shop);
    const tokens = await this.authService.generateToken({
      userId: userClaim.userId,
      sessionId: userClaim.sessionId,
      shopId: shop.id,
      shopRole: "OWNER",
    });

    return { ...response, ...tokens };
  }

  protected override _toResponse(shop: Loaded<Shop, "owner">): ShopResponse {
    const { owner, ...data } = wrap(shop).serialize({
      forceObject: true,
    });

    return {
      ...data,
      ownerId: owner.id,
    };
  }

  private _toDetailResponse(shop: Loaded<Shop, "description" | "owner">): ShopDetailResponse {
    const { owner, description, ...data } = wrap(shop).serialize({
      forceObject: true,
    });

    return {
      ...data,
      description: description ?? null,
      ownerId: owner.id,
    };
  }
}
