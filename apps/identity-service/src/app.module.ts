import { CommonConfigModule } from "@libs/common";
import { DatabaseConfig, databaseConfig, jwtConfig, redisConfig, RedisModule } from "@libs/core";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { githubConfig, googleConfig } from "./config";
import { AuthModule } from "./module/auth/auth.module";
import { UserModule } from "./module/user/user.module";

@Module({
  imports: [
    CommonConfigModule.forRoot({
      load: [jwtConfig, googleConfig, githubConfig, databaseConfig, redisConfig],
    }),
    MikroOrmModule.forRootAsync({
      inject: [databaseConfig.KEY],
      driver: PostgreSqlDriver,
      useFactory: (config: DatabaseConfig) => ({
        ...config,
        autoLoadEntities: true,
      }),
    }),
    RedisModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
