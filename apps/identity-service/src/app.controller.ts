import { Controller, Get } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

@Controller()
export class AppController {
  @Get()
  root() {
    return { service: "identity-service", transport: "http", port: 8080 };
  }

  @MessagePattern("ping")
  onPing() {
    return { service: "identity-service", transport: "tcp" };
  }
}
