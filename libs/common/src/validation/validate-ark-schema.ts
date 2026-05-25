import { ArkErrors, type Type } from "arktype";

export function validateArkSchema<T extends Type>(
  schema: T,
  data: unknown,
  createError: (errors: ArkErrors) => Error,
): T["infer"] {
  const result = schema(data);
  if (result instanceof ArkErrors) {
    throw createError(result);
  }
  return result;
}
