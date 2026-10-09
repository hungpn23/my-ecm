import {
  INTERNAL_AUTH_HEADER,
  InternalAuthSecret,
  internalAuthConfig,
  type InternalAuthConfig,
} from "@libs/core";
import {
  type CanActivate,
  type ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { timingSafeEqual } from "node:crypto";
import type { IncomingHttpHeaders } from "node:http";

@Injectable()
export class InternalAuthGuard implements CanActivate {
  constructor(@Inject(internalAuthConfig.KEY) private readonly config: InternalAuthConfig) {}

  canActivate(context: ExecutionContext): boolean {
    const { headers } = context.switchToHttp().getRequest<{ headers: IncomingHttpHeaders }>();
    const secret = headers[INTERNAL_AUTH_HEADER];
    if (!InternalAuthSecret.allows(secret)) throw new UnauthorizedException();

    const received = Buffer.from(secret, "utf8");
    const expected = Buffer.from(this.config.secret, "utf8");
    if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
