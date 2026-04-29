import { ArkErrors, type Type } from "arktype";

export function validateArkSchema<T extends Type>(
	schema: T,
	config: Record<string, string | undefined> = Bun.env,
): T["infer"] {
	const result = schema(config);

	if (result instanceof ArkErrors) {
		throw new Error(`Invalid environment configuration:\n${result.summary}`);
	}

	return result;
}
