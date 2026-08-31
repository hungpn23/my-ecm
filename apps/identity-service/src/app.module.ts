import {
  BaseConfigModule,
  type DatabaseConfig,
  databaseConfig,
  jwtConfig,
  redisConfig,
  RedisModule,
} from "@libs/core";
import { entities } from "@mikro-orm/generated";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Module } from "@nestjs/common";
import { ConditionalModule } from "@nestjs/config";
import { LoggerModule } from "nestjs-pino";
import { AppController } from "./app.controller";
import { AuthModule } from "./module/auth/auth.module";
import { isGithubConfigured } from "./module/oauth/github/github.config";
import { GithubModule } from "./module/oauth/github/github.module";
import { isGoogleConfigured } from "./module/oauth/google/google.config";
import { GoogleModule } from "./module/oauth/google/google.module";
import { UserModule } from "./module/user/user.module";

@Module({
  imports: [
    BaseConfigModule.forRoot({
      load: [jwtConfig, databaseConfig, redisConfig],
    }),
    MikroOrmModule.forRootAsync({
      inject: [databaseConfig.KEY],
      driver: PostgreSqlDriver,
      useFactory: (config: DatabaseConfig) => ({
        ...config,
        entities,
      }),
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: "debug",
        transport: {
          target: "pino-pretty",
          options: {
            customColors: "error:bgRed",
            ignore: "req.headers,res.headers,remoteAddress,remotePort",
          },
        },
      },
    }),
    RedisModule,
    AuthModule,
    ConditionalModule.registerWhen(GoogleModule, isGoogleConfigured, {
      debug: false,
    }),
    ConditionalModule.registerWhen(GithubModule, isGithubConfigured, {
      debug: false,
    }),
    UserModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
