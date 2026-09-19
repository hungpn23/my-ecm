import { ArktypeValidationPipe, LoggerModule } from "@libs/common";
import {
  AuthModule,
  ConfigModule,
  DatabaseModule,
  JwtGuard,
  KafkaModule,
  RedisModule,
} from "@libs/core";
import { entities } from "@mikro-orm/generated";
import { Module, StandardSchemaSerializerInterceptor } from "@nestjs/common";
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { CategoryModule } from "./module/category/category.module";
import { ProductModule } from "./module/product/product.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule.forRoot(entities),
    LoggerModule.forRoot(),
    RedisModule,
    AuthModule,
    KafkaModule.forRoot(),
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
      useClass: ArktypeValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: StandardSchemaSerializerInterceptor,
    },
  ],
})
export class AppModule {}
