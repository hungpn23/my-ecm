import { type } from "arktype";

import { EntityHttpResponse } from "../shared/entity-response.schema";
import { Varchar255 } from "../shared/string.schema";

export const CreateAddress = type({
  recipientName: Varchar255,
  phone: Varchar255,
  address: "string",
});
export type CreateAddress = typeof CreateAddress.infer;

export const EditAddress = CreateAddress.partial();
export type EditAddress = typeof EditAddress.infer;

export const Address = EntityHttpResponse.merge(CreateAddress).merge({ isDefault: "boolean" });
export type Address = typeof Address.inferIn;

export const Addresses = type({ addresses: Address.array() });
export type Addresses = typeof Addresses.inferIn;
