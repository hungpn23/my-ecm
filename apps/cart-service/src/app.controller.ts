import { Controller, Get } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

@Controller()
export class AppController {
  @Get()
  root() {
    return { service: "cart-service", transport: "http", port: 8084 };
  }

  @MessagePattern("ping")
  onPing() {
    return { service: "cart-service", transport: "tcp" };
  }
}
