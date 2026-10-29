import { type } from "arktype";

import { Varchar255 } from "../shared/string.schema";

export const UserCreatedPayload = type({
  email: Varchar255.and("string.email"),
});
export type UserCreatedPayload = typeof UserCreatedPayload.inferIn;
