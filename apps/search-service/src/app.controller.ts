import { Controller, Get } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

@Controller()
export class AppController {
  @Get()
  root() {
    return { service: "search-service", transport: "http", port: 8083 };
  }

  @MessagePattern("ping")
  onPing() {
    return { service: "search-service", transport: "tcp" };
  }
}
