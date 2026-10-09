import { Uuid, type CurrentUser } from "@libs/contract";
import { AuthenticationRegistry, JwtBearerProvider, type JwtClaims } from "@nestjs/authentication";
import { Inject, Injectable } from "@nestjs/common";
import { IdentityCurrentUserClient } from "./identity-current-user.client";
import { jwtVerifyConfig, type JwtVerifyConfig } from "./jwt-verify.config";

@Injectable()
export class ResourceJwtAuth extends JwtBearerProvider<CurrentUser> {
  constructor(
    @Inject(jwtVerifyConfig.KEY) config: JwtVerifyConfig,
    private readonly users: IdentityCurrentUserClient,
    registry: AuthenticationRegistry,
  ) {
    super(config);
    registry.registerProvider(this);
  }

  protected override async validate({ sub }: JwtClaims): Promise<CurrentUser | null> {
    if (!Uuid.allows(sub)) return null;

    return await this.users.findById(sub);
  }
}
