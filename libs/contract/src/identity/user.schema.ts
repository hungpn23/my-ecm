import { type } from "arktype";

import { Uuid } from "../shared/common.schema";
import { EntityResponse } from "../shared/entity-response.schema";

export const ROLE = ["SYSTEM_ADMIN", "USER"] as const;
export const Role = type.enumerated(...ROLE);
export type Role = typeof Role.infer;

export const SHOP_ROLE = ["OWNER", "ADMIN", "STAFF"] as const;
export const ShopRole = type.enumerated(...SHOP_ROLE);
export type ShopRole = typeof ShopRole.infer;

export const User = EntityResponse.merge({
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

export const TcpUserResponse = User.merge({
  createdAt: "string.date.iso.parse",
  updatedAt: "string.date.iso.parse",
}).or("null");
export type TcpUserResponse = typeof TcpUserResponse.infer;
