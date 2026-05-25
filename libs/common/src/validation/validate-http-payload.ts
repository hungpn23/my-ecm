import { UnprocessableEntityException } from "@nestjs/common";
import { Type } from "arktype";
import { validateArkSchema } from "./validate-ark-schema";

export function validateHttpPayload<T extends Type>(schema: T, data: unknown): T["infer"] {
  return validateArkSchema(
    schema,
    data,
    (errors) => new UnprocessableEntityException(errors.summary),
  );
}
