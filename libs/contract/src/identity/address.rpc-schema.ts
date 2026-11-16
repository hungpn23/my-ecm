import { type } from "arktype";

import { Uuid } from "../shared/string.schema";

export const GetAddressById = type({
  addressId: Uuid,
  userId: Uuid,
});
export type GetAddressById = typeof GetAddressById.infer;
