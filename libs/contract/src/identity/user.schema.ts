import { type } from "arktype";

import { EntityHttpResponse } from "../shared/entity-response.schema";
import { Uuid, Varchar255 } from "../shared/string.schema";

export const ROLES = ["SYSTEM_ADMIN", "USER"] as const;
export const Role = type.enumerated(...ROLES);
export type Role = typeof Role.infer;

export const SHOP_ROLES = ["OWNER", "ADMIN", "STAFF"] as const;
export const ShopRole = type.enumerated(...SHOP_ROLES);
export type ShopRole = typeof ShopRole.infer;

export const User = EntityHttpResponse.merge({
  email: Varchar255.and("string.email"),
  role: Role,
}).merge(
  type({ shopId: Uuid, shopRole: ShopRole }).or({
    shopId: "null",
    shopRole: "null",
  }),
);
export type User = typeof User.inferIn;
export type ShopMember = Extract<User, { shopId: Uuid }>;
