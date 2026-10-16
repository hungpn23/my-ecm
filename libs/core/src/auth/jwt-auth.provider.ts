import { IdentityClient } from "#internal/microservice/microservice-clients";
import { UserResponse, Uuid } from "@libs/contract";
import { AuthenticationRegistry, JwtBearerProvider, type JwtClaims } from "@nestjs/authentication";
import { Inject, Injectable } from "@nestjs/common";
import { jwtConfig, type JwtConfig } from "./jwt.config";

@Injectable()
export class JwtAuth extends JwtBearerProvider<UserResponse> {
  constructor(
    @Inject(jwtConfig.KEY) config: JwtConfig,
    private readonly identityClient: IdentityClient,
    registry: AuthenticationRegistry,
  ) {
    super(config);
    registry.registerProvider(this);
  }

  protected override async validate({ sub }: JwtClaims): Promise<UserResponse | null> {
    if (!Uuid.allows(sub)) return null;

    return await this.identityClient.send("get.user", { id: sub });
  }
}
