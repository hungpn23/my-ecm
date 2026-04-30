import { Controller, Get } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

@Controller()
export class AppController {
	@Get()
	root() {
		return { service: "order-service", transport: "http", port: 8085 };
	}

	@MessagePattern("ping")
	onPing(payload: unknown) {
		return { service: "order-service", transport: "tcp", echo: payload };
	}
}
