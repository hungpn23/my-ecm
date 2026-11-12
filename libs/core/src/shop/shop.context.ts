import type { ShopMember, ShopOwner, Uuid } from "@libs/contract";
import { AuthenticationContext } from "@nestjs/authentication";
import { ForbiddenException, Injectable } from "@nestjs/common";

import { isShopMember, isShopOwner } from "./shop.helper";

@Injectable()
export class ShopContext {
  constructor(private readonly authContext: AuthenticationContext) {}

  get member(): ShopMember {
    const user = this.authContext.requireUser();

    if (!isShopMember(user)) {
      throw new ForbiddenException("User is not a shop member", { errorCode: "USER_NOT_SHOP_MEMBER" });
    }

    return user;
  }

  get shopId(): Uuid {
    return this.member.shopId;
  }

  get owner(): ShopOwner {
    const user = this.authContext.requireUser();

    if (!isShopOwner(user)) {
      throw new ForbiddenException("User is not a shop owner", { errorCode: "USER_NOT_SHOP_OWNER" });
    }

    return user;
  }
}
