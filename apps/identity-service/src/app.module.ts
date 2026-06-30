import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { CommonConfigModule } from "@libs/common";
import { githubConfig, googleConfig, jwtConfig } from "./config";

@Module({
  imports: [
    CommonConfigModule.forRoot({
      load: [jwtConfig, googleConfig, githubConfig],
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
