import { ArktypeValidationPipe, MikroOrmExceptionFilter, RxjsExceptionFilter } from "@libs/common";
import { AuthModule, ConfigModule, DatabaseModule, LoggerModule } from "@libs/core";
import { Module, StandardSchemaSerializerInterceptor } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";

import { entities } from "#mikro-orm/generated";

import { CategoryModule } from "./module/category/category.module";
import { ProductCatalogModule } from "./module/product-catalog/product-catalog.module";
import { ProductModule } from "./module/product/product.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule.forRoot(entities),
    LoggerModule.forRoot(),
    AuthModule,
    CategoryModule,
    ProductModule,
    ProductCatalogModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: RxjsExceptionFilter,
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
