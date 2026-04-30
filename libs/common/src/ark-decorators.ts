import {
	ExecutionContext,
	UnprocessableEntityException,
	createParamDecorator,
} from "@nestjs/common";
import { ArkErrors, type Type } from "arktype";

function validate(schema: Type, data: unknown) {
	const result = schema(data);
	if (result instanceof ArkErrors) {
		throw new UnprocessableEntityException(result.summary);
	}
	return result;
}

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
