import { entities } from "#mikro-orm/generated";
import {
  ArktypeValidationPipe,
  MikroOrmExceptionFilter,
  RpcCallerExceptionFilter,
} from "@libs/common";
import { AuthModule, ConfigModule, DatabaseModule, LoggerModule } from "@libs/core";
import { Module, StandardSchemaSerializerInterceptor } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { CategoryModule } from "./module/category/category.module";
import { ProductModule } from "./module/product/product.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule.forRoot(entities),
    LoggerModule.forRoot(),
    AuthModule,
    CategoryModule,
    ProductModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: RpcCallerExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: MikroOrmExceptionFilter,
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
