import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { AuthenticatedSeller, AuthenticatedSellerRequest } from "./auth.schema";

export function Seller<S extends AuthenticatedSeller>(key?: keyof S): ParameterDecorator {
  const decorator = createParamDecorator((key: keyof S | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<AuthenticatedSellerRequest<S>>();
    const user = request.user;

    return key ? user[key] : user;
  });

  return decorator(key);
}
