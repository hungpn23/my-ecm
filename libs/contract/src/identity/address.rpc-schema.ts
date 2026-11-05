import { type } from "arktype";

import { EntityRpcResponse } from "../shared/entity-response.rpc-schema";
import { Uuid } from "../shared/string.schema";
import { Address } from "./address.schema";

export const GetAddressById = type({
  addressId: Uuid,
  userId: Uuid,
});
export type GetAddressById = typeof GetAddressById.infer;

export const AddressRpc = Address.merge(EntityRpcResponse).or("null");
export type AddressRpc = typeof AddressRpc.infer;
