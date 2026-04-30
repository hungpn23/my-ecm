import { Controller, Get } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

@Controller()
export class AppController {
	@Get()
	root() {
		return { service: "shipping-service", transport: "http", port: 8087 };
	}

	@MessagePattern("ping")
	onPing(payload: unknown) {
		return { service: "shipping-service", transport: "tcp", echo: payload };
	}
}
