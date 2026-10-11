import { ExternalUserResponse, Uuid } from "@libs/contract";
import { AuthenticationRegistry, JwtBearerProvider, type JwtClaims } from "@nestjs/authentication";
import { Inject, Injectable } from "@nestjs/common";
import { IdentityClient } from "../microservice";
import { jwtVerifyConfig, type JwtVerifyConfig } from "./jwt-verify.config";

@Injectable()
export class ResourceJwtAuth extends JwtBearerProvider<ExternalUserResponse> {
  constructor(
    @Inject(jwtVerifyConfig.KEY) config: JwtVerifyConfig,
    registry: AuthenticationRegistry,
    private readonly identityClient: IdentityClient,
  ) {
    super(config);
    registry.registerProvider(this);
  }

  protected override async validate({ sub }: JwtClaims): Promise<ExternalUserResponse | null> {
    if (!Uuid.allows(sub)) return null;

    return await this.identityClient.send("get.user", { id: sub });
  }
}
