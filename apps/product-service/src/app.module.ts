import { entities } from "#mikro-orm/generated";
import { ArktypeValidationPipe } from "@libs/common";
import {
  ConfigModule,
  DatabaseModule,
  LoggerModule,
  ResourceAuthenticationModule,
} from "@libs/core";
import { Module, StandardSchemaSerializerInterceptor } from "@nestjs/common";
import { APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { CategoryModule } from "./module/category/category.module";
import { ProductModule } from "./module/product/product.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule.forRoot(entities),
    LoggerModule.forRoot(),
    ResourceAuthenticationModule,
    CategoryModule,
    ProductModule,
  ],
  providers: [
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
