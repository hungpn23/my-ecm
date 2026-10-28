import { type } from "arktype";

import { DateToISOString } from "./date.schema";
import { Uuid } from "./string.schema";

export const EntityHttpResponse = type({
  id: Uuid,
  createdAt: DateToISOString,
  updatedAt: DateToISOString,
});
export type EntityHttpResponse = typeof EntityHttpResponse.inferIn;
