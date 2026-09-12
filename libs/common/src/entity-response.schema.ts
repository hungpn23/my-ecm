import { type } from "arktype";
import { UuidSchema } from "./common.schema";

export const EntityResponseSchema = type({
  id: UuidSchema,
  createdAt: type("string.date.iso").configure({ format: "date-time" }),
  updatedAt: type("string.date.iso").configure({ format: "date-time" }),
});
