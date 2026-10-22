import { type } from "arktype";

import { Uuid } from "../shared/common.schema";

export const GetUserByIdPayload = type({
  id: Uuid,
});
export type GetUserByIdPayload = typeof GetUserByIdPayload.inferIn;
