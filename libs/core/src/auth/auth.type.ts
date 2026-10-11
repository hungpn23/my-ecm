import type { UserResponse } from "@libs/contract";
import type { JwtClaims } from "@nestjs/authentication";

declare module "@nestjs/authentication" {
  interface AuthenticationTypes {
    user: UserResponse;
    session: JwtClaims;
  }
}
