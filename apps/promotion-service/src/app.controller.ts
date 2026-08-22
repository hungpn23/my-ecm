import { Controller, Get } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

@Controller()
export class AppController {
  @Get()
  root() {
    return { service: "promotion-service", transport: "http", port: 8092 };
  }

  @MessagePattern("ping")
  onPing() {
    return { service: "promotion-service", transport: "tcp" };
  }
}
