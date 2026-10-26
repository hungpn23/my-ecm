import { type } from "arktype";

import { Varchar255 } from "../shared/common.schema";
import { EntityResponse } from "../shared/entity-response.schema";

export const CreateAddress = type({
  recipientName: Varchar255,
  phone: Varchar255,
  address: Varchar255,
});
export type CreateAddress = typeof CreateAddress.infer;

export const EditAddress = CreateAddress.partial();
export type EditAddress = typeof EditAddress.infer;

export const Address = EntityResponse.merge(CreateAddress).merge({ isDefault: "boolean" });
export type Address = typeof Address.inferIn;

export const Addresses = type({ addresses: Address.array() });
export type Addresses = typeof Addresses.inferIn;
