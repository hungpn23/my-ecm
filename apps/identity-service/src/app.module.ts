import { ArktypeValidationPipe, ServerExceptionFilter } from "@libs/common";
import { ConfigModule, DatabaseModule, LoggerModule, MicroserviceModule, ObserveModule } from "@libs/core";
import { Module, StandardSchemaSerializerInterceptor } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";

import { entities } from "#mikro-orm/generated";

import { AddressModule } from "./module/address/address.module";
import { AuthModule } from "./module/auth/auth.module";
import { ShopModule } from "./module/shop/shop.module";
import { UserModule } from "./module/user/user.module";

@Module({
  imports: [
    ObserveModule.forRoot(),
    ConfigModule.forRoot(),
    DatabaseModule.forRoot(entities),
    LoggerModule.forRoot(),
    MicroserviceModule.registerAsync("NOTIFICATION_SERVICE"),
    AuthModule,
    AddressModule,
    ShopModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ServerExceptionFilter,
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
