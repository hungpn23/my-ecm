import { ArktypeValidationPipe } from "@libs/common";
import {
  AuthModule,
  ConfigModule,
  JwtGuard,
  KafkaModule,
  LoggerModule,
  RedisModule,
} from "@libs/core";
import { Module, StandardSchemaSerializerInterceptor } from "@nestjs/common";
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";

@Module({
  imports: [
    ConfigModule.forRoot(),
    LoggerModule.forRoot(),
    RedisModule.forRoot(),
    KafkaModule.forRoot(),
    AuthModule,
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
