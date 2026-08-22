import { Controller, Get } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

@Controller()
export class AppController {
  @Get()
  root() {
    return { service: "report-service", transport: "http", port: 8093 };
  }

  @MessagePattern("ping")
  onPing() {
    return { service: "report-service", transport: "tcp" };
  }
}
