import { createParamDecorator, SetMetadata, type ExecutionContext } from "@nestjs/common";
import { METADATA_KEY } from "./auth.constant";
import type { AuthenticatedRequest, AuthenticatedUser } from "./auth.schema";

export const PublicEndpoint = () => SetMetadata(METADATA_KEY.IS_PUBLIC_ENDPOINT, true);

export const User = createParamDecorator(
  (data: keyof AuthenticatedUser, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user; // user is set in the JwtStrategy.validate() method after successful authentication

    return data ? user[data] : user;
  },
);
