import { GlobalLoggerModule, GlobalStandardSchemaValidationPipe } from "@libs/common";
import { GlobalConfigModule, jwtConfig, JwtGuard, redisConfig, RedisModule } from "@libs/core";
import { Module, StandardSchemaSerializerInterceptor } from "@nestjs/common";
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AuthModule } from "./module/auth/auth.module";

@Module({
  imports: [
    GlobalConfigModule.forRoot({ load: [jwtConfig, redisConfig] }),
    GlobalLoggerModule.forRoot(),
    RedisModule,
    AuthModule,
  ],
  controllers: [AppController],
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
