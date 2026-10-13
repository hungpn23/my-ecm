import { RpcException } from "@nestjs/microservices";

export type HandlerRpcExceptionPayload = {
  message: string;
  statusCode: number;
  code?: string;
};

export class HandlerRpcException extends RpcException {
  constructor({ message, statusCode, code }: HandlerRpcExceptionPayload) {
    super({ type: HandlerRpcException.name, message, statusCode, code });
  }
}
