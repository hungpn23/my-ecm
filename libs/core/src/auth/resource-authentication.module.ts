import { ConfigModule } from "#internal/config/index";
import { AuthenticationModule } from "@nestjs/authentication";
import { Module } from "@nestjs/common";
import { jwtVerifyConfig } from "./jwt-verify.config";
import { IdentityCurrentUserClient } from "./identity-current-user.client";
import { identityCurrentUserConfig } from "./identity-current-user.config";
import { internalAuthConfig } from "./internal-auth.config";
import { ResourceJwtAuth } from "./resource-jwt-auth.provider";
import { SellerGuard } from "./seller.guard";

@Module({
  imports: [
    AuthenticationModule.forRoot(),
    ConfigModule.forFeatures(jwtVerifyConfig, identityCurrentUserConfig, internalAuthConfig),
  ],
  providers: [IdentityCurrentUserClient, ResourceJwtAuth, SellerGuard],
  exports: [SellerGuard],
})
export class ResourceAuthenticationModule {}
