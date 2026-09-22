import { EntityResponse } from "@libs/common";

export const UserResponse = EntityResponse.merge({
  email: "string.email",
});
export type UserResponse = typeof UserResponse.inferIn;
