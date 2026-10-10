import { entities } from "#mikro-orm/generated";
import { ArktypeValidationPipe } from "@libs/common";
import { ConfigModule, DatabaseModule, LoggerModule } from "@libs/core";
import { Module, StandardSchemaSerializerInterceptor } from "@nestjs/common";
import { APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { AuthModule } from "./module/auth/auth.module";
import { ShopModule } from "./module/shop/shop.module";
import { UserModule } from "./module/user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule.forRoot(entities),
    LoggerModule.forRoot(),
    AuthModule,
    ShopModule,
    UserModule,
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
