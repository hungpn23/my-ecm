import { type UserResponse, Uuid } from "@libs/contract";
import { AuthenticationRegistry, JwtBearerProvider, type JwtClaims } from "@nestjs/authentication";
import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";

@Injectable()
export class JwtAuthProvider extends JwtBearerProvider<UserResponse> {
  constructor(
    private readonly user: UserService,
    registry: AuthenticationRegistry,
  ) {
    super();
    registry.registerProvider(this);
  }

  protected override async validate({ sub }: JwtClaims): Promise<UserResponse | null> {
    if (!Uuid.allows(sub)) return null;

    return await this.user.findById(sub);
  }
}
