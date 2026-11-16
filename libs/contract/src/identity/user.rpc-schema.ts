import { type } from "arktype";

import { Uuid } from "../shared/string.schema";

export const GetUserById = type({
  userId: Uuid,
});
export type GetUserById = typeof GetUserById.infer;
