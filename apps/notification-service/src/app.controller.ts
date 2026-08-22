import { Controller, Get } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

@Controller()
export class AppController {
  @Get()
  root() {
    return { service: "notification-service", transport: "http", port: 8088 };
  }

  @MessagePattern("ping")
  onPing() {
    return { service: "notification-service", transport: "tcp" };
  }
}
