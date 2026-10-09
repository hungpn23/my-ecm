import { CurrentUser, type Uuid } from "@libs/contract";
import { Inject, Injectable, ServiceUnavailableException } from "@nestjs/common";
import { type } from "arktype";
import {
  identityCurrentUserConfig,
  type IdentityCurrentUserConfig,
} from "./identity-current-user.config";
import {
  INTERNAL_AUTH_HEADER,
  internalAuthConfig,
  type InternalAuthConfig,
} from "./internal-auth.config";

@Injectable()
export class IdentityCurrentUserClient {
  constructor(
    @Inject(identityCurrentUserConfig.KEY) private readonly config: IdentityCurrentUserConfig,
    @Inject(internalAuthConfig.KEY) private readonly internal: InternalAuthConfig,
  ) {}

  // TEMPORARY: Replace HTTP inside this method with Kafka request/reply when that transport is added.
  async findById(userId: Uuid): Promise<CurrentUser | null> {
    let response: Response;
    let body: unknown;

    try {
      response = await fetch(new URL(`/internal/auth/users/${userId}`, this.config.origin), {
        headers: { [INTERNAL_AUTH_HEADER]: this.internal.secret },
        signal: AbortSignal.timeout(2_000),
        redirect: "error",
        cache: "no-store",
      });
      if (response.status === 404) return null;
      if (response.status !== 200) throw new ServiceUnavailableException();
      body = await response.json();
    } catch {
      throw new ServiceUnavailableException("Identity user lookup unavailable");
    }

    const user = CurrentUser(body);
    if (user instanceof type.errors || user.id !== userId) {
      throw new ServiceUnavailableException("Invalid identity user response");
    }

    return user;
  }
}
