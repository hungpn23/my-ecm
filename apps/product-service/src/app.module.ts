import { GlobalLoggerModule, GlobalStandardSchemaValidationPipe } from "@libs/common";
import {
  databaseConfig,
  GlobalConfigModule,
  jwtConfig,
  JwtGuard,
  redisConfig,
  RedisModule,
} from "@libs/core";
import { Module, StandardSchemaSerializerInterceptor } from "@nestjs/common";
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { AuthModule } from "./module/auth/auth.module";

@Module({
  imports: [
    GlobalConfigModule.forRoot({
      load: [jwtConfig, databaseConfig, redisConfig],
    }),
    // MikroOrmModule.forRootAsync({
    //   inject: [databaseConfig.KEY],
    //   driver: PostgreSqlDriver,
    //   useFactory: (config: DatabaseConfig) => ({
    //     ...config,
    //     entities: [],
    //   }),
    // }),
    GlobalLoggerModule.forRoot(),
    RedisModule,
    AuthModule,
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
