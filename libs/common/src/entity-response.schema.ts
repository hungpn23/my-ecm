import { type } from "arktype";
import { DateToISOString, Uuid } from "./common.schema";

export const EntityResponse = type({
  id: Uuid,
  createdAt: DateToISOString,
  updatedAt: DateToISOString,
});
