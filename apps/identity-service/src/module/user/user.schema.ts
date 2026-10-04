import { EntityResponse, Uuid } from "@libs/common";
import { ShopRole } from "@libs/core";

export const UserResponse = EntityResponse.merge({
  email: "string.email",
  shopId: Uuid.or("null"),
  shopRole: ShopRole.or("null"),
});
export type UserResponse = typeof UserResponse.inferIn;
