import type { RpcError } from "@libs/contract";

export class RpcException extends Error {
  constructor(readonly payload: RpcError) {
    super();
  }
}
