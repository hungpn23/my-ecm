import type { NullableUser, User } from "@libs/contract";
import { isShopMember, isShopOwner } from "@libs/core";
import { Policy } from "@nestjs/authorization";

@Policy()
export class ShopPolicy {
  create(user: NullableUser): boolean {
    return !!user && !isShopMember(user);
  }

  addMember(user: NullableUser): boolean {
    return isShopOwner(user);
  }

  joinShop(user: User): boolean {
    return !isShopMember(user);
  }
}
