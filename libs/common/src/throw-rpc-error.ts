import { RPC_ERROR, RpcError } from "@libs/contract";
import { RpcException } from "@nestjs/microservices";

export function throwRpcError(error: RpcError) {
  if (RpcError.allows(error)) throw new RpcException(error);
  throw new RpcException(RPC_ERROR.INTERNAL_SERVER_ERROR);
}
