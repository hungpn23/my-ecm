import { type } from "arktype";

import { EntityRpcResponse } from "../shared/entity-response.rpc-schema";
import { Uuid } from "../shared/string.schema";
import { User } from "./user.schema";

export const GetUserByIdPayload = type({
  id: Uuid,
});
export type GetUserByIdPayload = typeof GetUserByIdPayload.inferIn;

export const UserRpc = User.merge(EntityRpcResponse).or("null");
export type UserRpc = typeof UserRpc.infer;
