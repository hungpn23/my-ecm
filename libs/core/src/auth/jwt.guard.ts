import { type ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { METADATA_KEY, PASSPORT_STRATEGY } from "./auth.constant";

@Injectable()
export class JwtGuard extends AuthGuard(PASSPORT_STRATEGY.JWT) {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  override canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublicEndpoint = this.reflector.getAllAndOverride<boolean>(
      METADATA_KEY.IS_PUBLIC_ENDPOINT,
      [context.getHandler(), context.getClass()],
    );
    if (isPublicEndpoint) return true;

    return super.canActivate(context);
  }
}
