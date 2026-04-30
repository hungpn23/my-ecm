import { UnprocessableEntityException } from "@nestjs/common";
import { ArkErrors, Type } from "arktype";

export function validate<T extends Type>(schema: T, data: unknown): T["infer"] {
	const result = schema(data);
	if (result instanceof ArkErrors) {
		throw new UnprocessableEntityException(result.summary);
	}
	return result;
}
