import { type } from "arktype";

import { DateToISOString } from "./date.schema";
import { Uuid } from "./string.schema";

export const EntityResponse = type({
  id: Uuid,
  createdAt: DateToISOString,
  updatedAt: DateToISOString,
});
export type EntityResponse = typeof EntityResponse.inferIn;
