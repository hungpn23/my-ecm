import { AnyRecord, SuccessResponse } from "@libs/contract";
import { Public } from "@nestjs/authentication";
import {
  applyDecorators,
  Delete,
  Get,
  Header,
  HttpCode,
  Patch,
  Post,
  SerializeOptions,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse } from "@nestjs/swagger";
import type { Type } from "arktype";

export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export type EndpointParams = {
  path: string | string[];
  isPublic: boolean;
  request: typeof AnyRecord;
  response: typeof AnyRecord;
  query: typeof AnyRecord;
  params: typeof AnyRecord;
  headers: [string, string][];
};

export function Endpoint(method: HttpMethod, params: Partial<EndpointParams>) {
  const decorators: MethodDecorator[] = [];

  if (params.query) {
    // TODO: Add query parameter decorators
  }

  if (params.params) {
    // TODO: Add path parameter decorators
  }

  if (params.request) decorators.push(ApiBody({ schema: toJsonSchema(params.request, "input") }));

  if (params.response) {
    decorators.push(SerializeOptions({ schema: params.response }));
    decorators.push(ApiResponse({ schema: toJsonSchema(params.response, "output") }));
  } else {
    decorators.push(SerializeOptions({ schema: SuccessResponse }));
    decorators.push(ApiResponse({ schema: toJsonSchema(SuccessResponse, "output") }));
  }

  switch (method) {
    case "GET":
      decorators.push(Get(params.path));
      break;
    case "POST":
      decorators.push(Post(params.path));
      decorators.push(HttpCode(200));
      break;
    case "PATCH":
      decorators.push(Patch(params.path));
      break;
    case "DELETE":
      decorators.push(Delete(params.path));
      break;
  }

  if (params.isPublic) {
    decorators.push(Public());
  } else {
    decorators.push(ApiBearerAuth());
  }

  if (params.headers?.length) {
    for (const [name, value] of params.headers) {
      decorators.push(Header(name, value));
    }
  }

  return applyDecorators(...decorators);
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
