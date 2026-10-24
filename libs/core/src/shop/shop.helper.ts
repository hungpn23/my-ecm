import type { ShopMember, User } from "@libs/contract";

export function isShopMember(user: User | null): user is ShopMember {
  return Boolean(user?.shopId) && Boolean(user?.shopRole);
}
