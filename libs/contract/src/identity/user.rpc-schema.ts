import { type } from "arktype";

import { EntityResponseFromRpc } from "../shared/entity-response.rpc-schema";
import { Uuid } from "../shared/string.schema";
import { User } from "./user.schema";

export const GetUserByIdPayload = type({
  id: Uuid,
});
export type GetUserByIdPayload = typeof GetUserByIdPayload.inferIn;

export const UserFromRpc = User.merge(EntityResponseFromRpc);

export const NullableUserFromRpc = UserFromRpc.or("null");
