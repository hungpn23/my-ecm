import type { AuthenticatedSeller, AuthenticatedUser } from "./auth.schema";

export function isSeller(user: AuthenticatedUser): user is AuthenticatedSeller {
  return "shopId" in user && "shopRole" in user;
}
