import { type } from "arktype";
import { Uuid } from "./common.schema";

export const EntityResponse = type({
  id: Uuid,
  createdAt: type("string.date.iso").configure({ format: "date-time" }),
  updatedAt: type("string.date.iso").configure({ format: "date-time" }),
});
