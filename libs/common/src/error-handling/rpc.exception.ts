import type { RpcError } from "@libs/contract";

export class RpcException extends Error {
  constructor(public readonly payload: RpcError) {
    super();
  }
}
