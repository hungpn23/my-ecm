import { type } from "arktype";

import { DateValue } from "./date.schema";
import { Uuid } from "./string.schema";

export const EntityResponse = type({
  id: Uuid,
  createdAt: DateValue,
  updatedAt: DateValue,
});
export type EntityResponse = typeof EntityResponse.infer;
