import { Controller, Get } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

@Controller()
export class AppController {
  @Get()
  root() {
    return { service: "product-service", transport: "http", port: 8081 };
  }

  @MessagePattern("ping")
  onPing(payload: unknown) {
    return { service: "product-service", transport: "tcp", echo: payload };
  }
}
