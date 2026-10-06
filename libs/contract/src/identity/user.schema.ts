import { Uuid } from "../shared/common.schema";
import { EntityResponse } from "../shared/entity-response.schema";
import { Role, ShopRole } from "./authenticated-user.schema";

export const UserResponse = EntityResponse.merge({
  email: "string.email",
  role: Role,
  shopId: Uuid.or("null"),
  shopRole: ShopRole.or("null"),
});
export type UserResponse = typeof UserResponse.inferIn;
