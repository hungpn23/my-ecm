import type { AuthenticatedSeller, AuthenticatedUser } from "@libs/contract";

export function isSeller(user: AuthenticatedUser): user is AuthenticatedSeller {
  return "shopId" in user && "shopRole" in user;
}
