import {
  applyDecorators,
  Delete,
  Get,
  Patch,
  Post,
  SerializeOptions,
  SetMetadata,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse } from "@nestjs/swagger";
import { type Type } from "arktype";
import { METADATA_KEY } from "./common.constant";
import { SuccessResponse } from "./success-response.schema";

type EndpointParams = {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path?: string | string[];
  isPublic?: boolean;
  request?: Type;
  response?: Type;
};

export function Endpoint(params: EndpointParams) {
  const decorators: MethodDecorator[] = [];

  if (params.request) {
    decorators.push(
      ApiBody({
        schema: params.request["~standard"].jsonSchema.input({
          target: "draft-2020-12",
        }),
      }),
    );
  }

  if (params.response) {
    decorators.push(SerializeOptions({ schema: params.response }));
    decorators.push(
      ApiResponse({
        schema: params.response["~standard"].jsonSchema.output({
          target: "draft-2020-12",
        }),
      }),
    );
  } else {
    decorators.push(SerializeOptions({ schema: SuccessResponse }));
    decorators.push(
      ApiResponse({
        schema: SuccessResponse["~standard"].jsonSchema.output({
          target: "draft-2020-12",
        }),
      }),
    );
  }

  switch (params.method) {
    case "GET":
      decorators.push(Get(params.path));
      break;
    case "POST":
      decorators.push(Post(params.path));
      break;
    case "PATCH":
      decorators.push(Patch(params.path));
      break;
    case "DELETE":
      decorators.push(Delete(params.path));
      break;
  }

  if (params.isPublic) {
    decorators.push(SetMetadata(METADATA_KEY.IS_PUBLIC_ENDPOINT, true));
  } else {
    decorators.push(ApiBearerAuth());
  }

  return applyDecorators(...decorators);
}
