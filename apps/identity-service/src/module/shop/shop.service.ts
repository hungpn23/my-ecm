import type { CreateShop, ShopDetail, User, Uuid } from "@libs/contract";
import { ShopContext } from "@libs/core";
import { LockMode } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { AuthenticationContext } from "@nestjs/authentication";
import { AuthorizationService } from "@nestjs/authorization";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectPinoLogger, type PinoLogger } from "nestjs-pino";

import { ShopEntity, UserEntity } from "#internal/database/entity/index";

import { ShopPolicy } from "./shop.policy";

@Injectable()
export class ShopService {
  constructor(
    @InjectPinoLogger(ShopService.name) private readonly logger: PinoLogger,
    private readonly em: EntityManager,
    private readonly authContext: AuthenticationContext,
    private readonly shopContext: ShopContext,
    private readonly authorization: AuthorizationService,
  ) {}

  async create(body: CreateShop): Promise<ShopDetail> {
    return await this.em.transactional(async (em) => {
      const user = await em.findOneOrFail(
        UserEntity,
        {
          id: this.authContext.requireUser().id,
        },
        { populate: ["shop"], lockMode: LockMode.PESSIMISTIC_WRITE },
      );

      const canJoinShop = await this.authorization.can(ShopPolicy, "joinShop", user.toObject());
      if (!canJoinShop) {
        throw new ForbiddenException("User is not allowed to join the shop", {
          errorCode: "JOIN_SHOP_NOT_ALLOWED",
        });
      }

      const newShop = em.create(ShopEntity, {
        ...body,
        description: body.description,
        owner: user,
      });

      newShop.addMember(user, "OWNER");

      await em.flush();

      this.logger.debug("Created new shop");

      const shop = await em.populate(newShop, ["owner", "description"]);
      return shop.toDetailResponse();
    });
  }

  async addMember(userId: Uuid): Promise<User> {
    return await this.em.transactional(async (em) => {
      const owner = this.shopContext.owner;
      const shop = await em.findOneOrFail(ShopEntity, { owner: owner.id });

      const user = await em.findOneOrFail(
        UserEntity,
        { id: userId },
        { populate: ["shop"], lockMode: LockMode.PESSIMISTIC_WRITE },
      );

      const canJoinShop = await this.authorization.can(ShopPolicy, "joinShop", user.toObject());
      if (!canJoinShop) {
        throw new ForbiddenException("User is not allowed to join the shop", {
          errorCode: "JOIN_SHOP_NOT_ALLOWED",
        });
      }

      shop.addMember(user, "STAFF");

      await em.flush();

      return user.toObject();
    });
  }
}
