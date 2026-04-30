import { Controller, Get } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

@Controller()
export class AppController {
	@Get()
	root() {
		return { service: "inventory-service", transport: "http", port: 8082 };
	}

	@MessagePattern("ping")
	onPing(payload: unknown) {
		return { service: "inventory-service", transport: "tcp", echo: payload };
	}
}
