import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { type Type } from "arktype";
import { validate } from "./validate-ark-schema";

export function ArkBody(schema: Type) {
  return createParamDecorator((_: unknown, ctx: ExecutionContext) =>
    validate(schema, ctx.switchToHttp().getRequest().body),
  )();
}

export function ArkParam(schema: Type) {
  return createParamDecorator((_: unknown, ctx: ExecutionContext) =>
    validate(schema, ctx.switchToHttp().getRequest().params),
  )();
}

export function ArkQuery(schema: Type) {
  return createParamDecorator((_: unknown, ctx: ExecutionContext) =>
    validate(schema, ctx.switchToHttp().getRequest().query),
  )();
}
