import type { Seller, User } from "@libs/contract";

export function isSeller(user: User): user is Seller {
  return !!user.shopId && !!user.shopRole;
}
