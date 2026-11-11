import { ArktypeValidationPipe, ServerExceptionFilter } from "@libs/common";
import { ConfigModule, LoggerModule, ObserveModule } from "@libs/core";
import { Module, StandardSchemaSerializerInterceptor } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";

import { UserModule } from "./module/user/user.module";

@Module({
  imports: [ObserveModule.forRoot(), ConfigModule.forRoot(), LoggerModule.forRoot(), UserModule],
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
