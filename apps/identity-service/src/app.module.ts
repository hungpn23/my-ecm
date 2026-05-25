import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { jwtConfig } from "./configs";
import { CommonConfigModule } from "@libs/common";

@Module({
  imports: [CommonConfigModule.forRoot({ load: [jwtConfig] }), AuthModule, UsersModule],
  controllers: [AppController],
})
export class AppModule {}
