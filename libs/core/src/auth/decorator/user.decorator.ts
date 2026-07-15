import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthenticatedRequest } from "../type/authenticated-request.type";
import { AuthenticatedUser } from "../type/authenticated-user.type";

export const User = createParamDecorator(
  (data: keyof AuthenticatedUser, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user; // user is set in the JwtStrategy.validate() method after successful authentication

    return data ? user[data] : user;
  },
);
