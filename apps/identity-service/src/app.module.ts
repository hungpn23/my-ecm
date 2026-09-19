import { GlobalStandardSchemaValidationPipe, LoggerModule } from "@libs/common";
import { ConfigModule, DatabaseModule, JwtGuard, KafkaModule, RedisModule } from "@libs/core";
import { entities } from "@mikro-orm/generated";
import { Module, StandardSchemaSerializerInterceptor } from "@nestjs/common";
import { ConditionalModule } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { AuthModule } from "./module/auth/auth.module";
import { GithubEnv } from "./module/oauth/github/github.config";
import { GithubModule } from "./module/oauth/github/github.module";
import { GoogleEnv } from "./module/oauth/google/google.config";
import { GoogleModule } from "./module/oauth/google/google.module";
import { UserModule } from "./module/user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule.forRoot(entities),
    LoggerModule.forRoot(),
    RedisModule,
    AuthModule,
    ConditionalModule.registerWhen(GoogleModule, GoogleEnv.allows, {
      debug: false,
    }),
    ConditionalModule.registerWhen(GithubModule, GithubEnv.allows, {
      debug: false,
    }),
    UserModule,
    KafkaModule.forRoot("identity-service"),
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
