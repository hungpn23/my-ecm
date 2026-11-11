import { ArktypeValidationPipe, ServerExceptionFilter } from "@libs/common";
import { AuthModule, ConfigModule, DatabaseModule, LoggerModule, ObserveModule } from "@libs/core";
import { Module, StandardSchemaSerializerInterceptor } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";

import { entities } from "#mikro-orm/generated";

import { StockModule } from "./module/stock/stock.module";

@Module({
  imports: [
    ObserveModule.forRoot(),
    ConfigModule.forRoot(),
    DatabaseModule.forRoot(entities),
    LoggerModule.forRoot(),
    AuthModule,
    StockModule,
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
