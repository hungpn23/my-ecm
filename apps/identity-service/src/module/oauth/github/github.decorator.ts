import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { Profile } from "passport-github2";
import type { GithubAuthenticatedRequest } from "./github.type";

export const GithubProfile = createParamDecorator(
  (data: keyof Profile, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<GithubAuthenticatedRequest>();
    const user = request.user; // user is set in the JwtStrategy.validate() method after successful authentication

    return data ? user[data] : user;
  },
);
