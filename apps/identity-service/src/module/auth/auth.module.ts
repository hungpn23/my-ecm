import { jwtConfig, type JwtConfig, JwtStrategy } from "@libs/core";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { User } from "@src/database/entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { RefreshStrategy } from "./refresh.strategy";

@Module({
  imports: [
    PassportModule.register({}),
    JwtModule.registerAsync({
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
    MikroOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, RefreshStrategy, JwtStrategy],
})
export class AuthModule {}
