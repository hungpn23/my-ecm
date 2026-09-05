import { GlobalLoggerModule, GlobalStandardSchemaValidationPipe } from "@libs/common";
import {
  databaseConfig,
  GlobalConfigModule,
  jwtConfig,
  JwtGuard,
  redisConfig,
  RedisModule,
  type DatabaseConfig,
} from "@libs/core";
import { entities } from "@mikro-orm/generated";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Module, StandardSchemaSerializerInterceptor } from "@nestjs/common";
import { ConditionalModule } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { AuthModule } from "./module/auth/auth.module";
import { isGithubConfigured } from "./module/oauth/github/github.config";
import { GithubModule } from "./module/oauth/github/github.module";
import { isGoogleConfigured } from "./module/oauth/google/google.config";
import { GoogleModule } from "./module/oauth/google/google.module";
import { UserModule } from "./module/user/user.module";

@Module({
  imports: [
    GlobalConfigModule.forRoot({
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
    GlobalLoggerModule.forRoot(),
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
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_PIPE,
      useClass: GlobalStandardSchemaValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: StandardSchemaSerializerInterceptor,
    },
  ],
})
export class AppModule {}
