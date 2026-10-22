import type { ShopMember, Uuid } from "@libs/contract";
import { AuthenticationContext } from "@nestjs/authentication";
import { ForbiddenException, Injectable } from "@nestjs/common";

import { isShopMember } from "./shop.helper";

@Injectable()
export class ShopContext {
  constructor(private readonly authContext: AuthenticationContext) {}

  get member(): ShopMember {
    const user = this.authContext.requireUser();
    if (!isShopMember(user)) throw new ForbiddenException("User is not a shop member");
    return user;
  }

  get shopId(): Uuid {
    return this.member.shopId;
  }
}
