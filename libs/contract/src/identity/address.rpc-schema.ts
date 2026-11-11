import { type } from "arktype";

import { EntityResponseFromRpc } from "../shared/entity-response.rpc-schema";
import { Uuid } from "../shared/string.schema";
import { Address } from "./address.schema";

export const GetAddressById = type({
  addressId: Uuid,
  userId: Uuid,
});
export type GetAddressById = typeof GetAddressById.infer;

export const AddressFromRpc = Address.merge(EntityResponseFromRpc);

export const NullableAddressFromRpc = AddressFromRpc.or("null");
