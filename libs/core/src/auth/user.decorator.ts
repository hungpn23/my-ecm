import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { AuthenticatedUser, AuthenticatedUserRequest } from "./auth.schema";

export function User<U extends AuthenticatedUser>(key?: keyof U): ParameterDecorator {
  const decorator = createParamDecorator((key: keyof U | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<AuthenticatedUserRequest<U>>();
    // user is set by one of these strategies: JwtStrategy, GithubStrategy, GoogleStrategy. (method: validate)
    const user = request.user;

    return key ? user[key] : user;
  });

  return decorator(key);
}
