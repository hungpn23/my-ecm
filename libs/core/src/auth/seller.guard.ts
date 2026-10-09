import type { UserResponse } from "@libs/contract";
import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";

@Injectable()
export class SellerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest<{ user?: UserResponse | null }>();
    if (!user?.shopId || !user.shopRole) throw new ForbiddenException("User is not a seller");

    return true;
  }
}
