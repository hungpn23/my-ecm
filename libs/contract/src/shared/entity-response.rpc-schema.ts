import { type } from "arktype";

import { DateFromISOString } from "./date.schema";
import { Uuid } from "./string.schema";

export const EntityRpcResponse = type({
  id: Uuid,
  createdAt: DateFromISOString,
  updatedAt: DateFromISOString,
});
export type EntityRpcResponse = typeof EntityRpcResponse.inferIn;
