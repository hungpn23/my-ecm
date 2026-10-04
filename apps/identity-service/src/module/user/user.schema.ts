import { EntityResponse, Uuid } from "@libs/common";
import { Role, ShopRole } from "@libs/core";

export const UserResponse = EntityResponse.merge({
  email: "string.email",
  role: Role,
  shopId: Uuid.or("null"),
  shopRole: ShopRole.or("null"),
});
export type UserResponse = typeof UserResponse.inferIn;
