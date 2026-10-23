import { AnyRecord, SuccessResponse } from "@libs/contract";
import { Public } from "@nestjs/authentication";
import { applyDecorators, Delete, Get, Header, Patch, Post, SerializeOptions } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse } from "@nestjs/swagger";
import type { Type } from "arktype";

export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export type EndpointParams = {
  path: string | string[];
  public: boolean;
  request: typeof AnyRecord;
  response: typeof AnyRecord;
  query: typeof AnyRecord;
  params: typeof AnyRecord;
  headers: [string, string][];
};

export function Endpoint(method: HttpMethod, params: Partial<EndpointParams>) {
  const decorators: MethodDecorator[] = [];

  if (params.request) decorators.push(ApiBody({ schema: toJsonSchema(params.request, "input") }));

  const response = params.response ?? SuccessResponse;
  decorators.push(
    SerializeOptions({ schema: response }),
    ApiResponse({ schema: toJsonSchema(response, "output") }),
    getRouteDecorator(method, params.path),
  );
  decorators.push(params.public ? Public() : ApiBearerAuth());

  if (params.headers?.length) {
    for (const [name, value] of params.headers) {
      decorators.push(Header(name, value));
    }
  }

  return applyDecorators(...decorators);
}

function getRouteDecorator(method: HttpMethod, path: EndpointParams["path"] | undefined): MethodDecorator {
  switch (method) {
    case "GET":
      return Get(path);
    case "POST":
      return Post(path);
    case "PATCH":
      return Patch(path);
    case "DELETE":
      return Delete(path);
    default:
      throw new Error(`Unsupported HTTP method`);
  }
}

function toJsonSchema(schema: Type<unknown>, direction: "input" | "output") {
  return schema["~standard"].jsonSchema[direction]({
    target: "draft-2020-12",
    libraryOptions: {
      fallback: {
        // Swagger cannot express custom predicates; the validation pipe still enforces them.
        predicate: (ctx) => ctx.base,
      },
    } satisfies NonNullable<Parameters<Type<unknown>["toJsonSchema"]>[0]>,
  });
}
