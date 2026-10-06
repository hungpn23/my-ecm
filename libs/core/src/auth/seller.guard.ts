import type { AuthenticatedUser } from "@libs/contract";
import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import type { AuthenticatedUserRequest } from "./auth-request.type";
import { isSeller } from "./seller.helper";

@Injectable()
export class SellerGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedUserRequest<AuthenticatedUser>>();

    if (!isSeller(request.user)) throw new ForbiddenException("User is not a seller");

    return true;
  }
}
