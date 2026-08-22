import { Controller, Get } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

@Controller()
export class AppController {
  @Get()
  root() {
    return { service: "media-service", transport: "http", port: 8091 };
  }

  @MessagePattern("ping")
  onPing() {
    return { service: "media-service", transport: "tcp" };
  }
}
