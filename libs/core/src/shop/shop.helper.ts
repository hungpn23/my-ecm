import type { NullableUser, ShopMember, ShopOwner } from "@libs/contract";

export function isShopMember(user: NullableUser): user is ShopMember {
  return !!user && !!user.shopId && !!user.shopRole;
}

export function isShopOwner(user: NullableUser): user is ShopOwner {
  return isShopMember(user) && user.shopRole === "OWNER";
}
