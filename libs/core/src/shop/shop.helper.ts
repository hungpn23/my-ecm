import type { ShopMember, User } from "@libs/contract";

export function isShopMember(user: User | null): user is ShopMember {
  return !!user?.shopId && !!user.shopRole;
}
