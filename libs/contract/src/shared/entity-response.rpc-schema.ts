import { DateFromISOString } from "./date.schema";
import { EntityResponse } from "./entity-response.schema";

export const EntityResponseFromRpc = EntityResponse.merge({
  createdAt: DateFromISOString,
  updatedAt: DateFromISOString,
});
