import { ConfigModule } from "#internal/config/index";
import { AuthenticationModule } from "@nestjs/authentication";
import { Module } from "@nestjs/common";
import { MicroserviceModule } from "../microservice";
import { jwtConfig } from "./jwt.config";
import { ResourceAuth } from "./resource-auth.provider";
import { SellerGuard } from "./seller.guard";

@Module({
  imports: [
    AuthenticationModule.forRoot(),
    ConfigModule.forFeatures(jwtConfig),
    MicroserviceModule.registerAsync("IDENTITY_SERVICE"),
  ],
  providers: [ResourceAuth, SellerGuard],
  exports: [SellerGuard],
})
export class ResourceAuthModule {}
