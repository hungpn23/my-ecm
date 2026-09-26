import { AuthModule as CoreAuthModule, jwtConfig, type JwtConfig } from "@libs/core";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { OutboxEvent, User } from "@src/database/entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { RefreshStrategy } from "./refresh.strategy";

@Module({
  imports: [
    CoreAuthModule,
    JwtModule.registerAsync({
      imports: [CoreAuthModule],
      inject: [jwtConfig.KEY],
      useFactory: (config: JwtConfig) => ({
        secret: config.JWT_SECRET,
        signOptions: {
          algorithm: config.JWT_ALGORITHM,
          issuer: config.JWT_ISSUER,
          audience: config.JWT_AUDIENCE,
        },
      }),
    }),
    MikroOrmModule.forFeature([User, OutboxEvent]),
  ],
  providers: [AuthService, RefreshStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
