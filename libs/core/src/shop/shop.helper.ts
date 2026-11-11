import type { NullableUser, ShopMember } from "@libs/contract";

export function isShopMember(user: NullableUser): user is ShopMember {
  return !!user?.shopId && !!user.shopRole;
}
