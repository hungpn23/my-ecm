import { type ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { PASSPORT_STRATEGY } from "../constant/passport-strategy";
import { ReflectorMetadataKey } from "../enum/reflector-metadata-key.enum";

@Injectable()
export class JwtGuard extends AuthGuard(PASSPORT_STRATEGY.JWT) {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  override canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublicEndpoint = this.reflector.getAllAndOverride<boolean>(
      ReflectorMetadataKey.IS_PUBLIC_ENDPOINT,
      [context.getHandler(), context.getClass()],
    );
    if (isPublicEndpoint) return true;

    return super.canActivate(context);
  }
}
