import type { AuthenticatedSeller } from "@libs/contract";
import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { AuthenticatedSellerRequest } from "./auth-request.type";

export function Seller<S extends AuthenticatedSeller>(key?: keyof S): ParameterDecorator {
  const decorator = createParamDecorator((key: keyof S | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<AuthenticatedSellerRequest<S>>();
    const user = request.user;

    return key ? user[key] : user;
  });

  return decorator(key);
}
