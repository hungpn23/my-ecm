import { ArktypeValidationPipe } from "@libs/common";
import { ConfigModule, KafkaModule, LoggerModule } from "@libs/core";
import { Module, StandardSchemaSerializerInterceptor } from "@nestjs/common";
import { APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { ProductModule } from "./module/product/product.module";
import { UserModule } from "./module/user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    LoggerModule.forRoot(),
    KafkaModule.forRoot(),
    UserModule,
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
