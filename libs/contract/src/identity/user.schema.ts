import { type } from "arktype";

import { EntityHttpResponse } from "../shared/entity-response.schema";
import { Uuid } from "../shared/string.schema";

export const ROLE = ["SYSTEM_ADMIN", "USER"] as const;
export const Role = type.enumerated(...ROLE);
export type Role = typeof Role.infer;

export const SHOP_ROLE = ["OWNER", "ADMIN", "STAFF"] as const;
export const ShopRole = type.enumerated(...SHOP_ROLE);
export type ShopRole = typeof ShopRole.infer;

export const User = EntityHttpResponse.merge({
  email: "string.email",
  role: Role,
}).merge(
  type({ shopId: Uuid, shopRole: ShopRole }).or({
    shopId: "null",
    shopRole: "null",
  }),
);
export type User = typeof User.inferIn;
export type ShopMember = Extract<User, { shopId: Uuid }>;
