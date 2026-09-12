import { GlobalLoggerModule, GlobalStandardSchemaValidationPipe } from "@libs/common";
import {
  databaseConfig,
  GlobalConfigModule,
  GlobalMikroOrmModule,
  jwtConfig,
  JwtGuard,
  redisConfig,
  RedisModule,
} from "@libs/core";
import { entities } from "@mikro-orm/generated";
import { Module, StandardSchemaSerializerInterceptor } from "@nestjs/common";
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { AuthModule } from "./module/auth/auth.module";
import { CategoryModule } from "./module/category/category.module";
import { ProductModule } from "./module/product/product.module";

@Module({
  imports: [
    GlobalConfigModule.forRoot({
      load: [jwtConfig, databaseConfig, redisConfig],
    }),
    GlobalMikroOrmModule.forRoot(entities),
    GlobalLoggerModule.forRoot(),
    RedisModule,
    AuthModule,
    CategoryModule,
    ProductModule,
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
