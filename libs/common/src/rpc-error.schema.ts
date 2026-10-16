import { HttpStatus } from "@nestjs/common";
import { type } from "arktype";

export const RpcError = type({
  statusCode: type.valueOf(HttpStatus),
  code: "string",
  message: "string",
});
export type RpcError = typeof RpcError.infer;

export const RPC_ERROR = {
  INTERNAL_SERVER_ERROR: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal server error",
  },
  NOT_IMPLEMENTED: {
    statusCode: HttpStatus.NOT_IMPLEMENTED,
    code: "NOT_IMPLEMENTED",
    message: "Not implemented yet",
  },
} as const satisfies Record<string, RpcError | ((...args: any[]) => RpcError)>;
