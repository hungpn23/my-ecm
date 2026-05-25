import { RpcException } from "@nestjs/microservices";
import { Type } from "arktype";
import { validateArkSchema } from "./validate-ark-schema";

export function validateMessagePayload<T extends Type>(schema: T, data: unknown): T["infer"] {
  return validateArkSchema(
    schema,
    data,
    (errors) =>
      new RpcException({
        code: "VALIDATION_ERROR",
        message: errors.summary,
      }),
  );
}
