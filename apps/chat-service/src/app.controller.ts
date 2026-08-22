import { Controller, Get } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

@Controller()
export class AppController {
  @Get()
  root() {
    return { service: "chat-service", transport: "http", port: 8089 };
  }

  @MessagePattern("ping")
  onPing() {
    return { service: "chat-service", transport: "tcp" };
  }
}
