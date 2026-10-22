import { User, Uuid } from "@libs/contract";
import { AuthenticationRegistry, JwtBearerProvider, type JwtClaims } from "@nestjs/authentication";
import { Inject, Injectable } from "@nestjs/common";

import { IdentityClient } from "#internal/microservice/microservice-clients";

import { type JwtConfig, jwtConfig } from "./jwt.config";

@Injectable()
export class JwtAuth extends JwtBearerProvider<User> {
  constructor(
    @Inject(jwtConfig.KEY) config: JwtConfig,
    private readonly identityClient: IdentityClient,
    registry: AuthenticationRegistry,
  ) {
    super(config);
    registry.registerProvider(this);
  }

  protected override async validate({ sub }: JwtClaims): Promise<User | null> {
    if (!Uuid.allows(sub)) return null;

    return await this.identityClient.send("get.user.by-id", { id: sub });
  }
}
