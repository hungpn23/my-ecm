import { type ExecutionContext, createParamDecorator } from "@nestjs/common";
import type { Type } from "arktype";
import { validateHttpPayload } from "./validate-http-payload";

export function ArkBody(schema: Type) {
  return createParamDecorator((_: unknown, ctx: ExecutionContext) =>
    validateHttpPayload(schema, ctx.switchToHttp().getRequest().body),
  )();
}

export function ArkParam(schema: Type) {
  return createParamDecorator((_: unknown, ctx: ExecutionContext) =>
    validateHttpPayload(schema, ctx.switchToHttp().getRequest().params),
  )();
}

export function ArkQuery(schema: Type) {
  return createParamDecorator((_: unknown, ctx: ExecutionContext) =>
    validateHttpPayload(schema, ctx.switchToHttp().getRequest().query),
  )();
}
