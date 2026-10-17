import type { SellerResponse, UserResponse } from "@libs/contract";

export function isSeller(user: UserResponse): user is SellerResponse {
  return !!user.shopId && !!user.shopRole;
}
