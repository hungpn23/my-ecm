import { Controller, Get } from "@nestjs/common"
import { MessagePattern } from "@nestjs/microservices"

@Controller()
export class AppController {
	@Get()
	root() {
		return { service: "payment-service", transport: "http", port: 8086 }
	}

	@MessagePattern("ping")
	onPing(payload: unknown) {
		return { service: "payment-service", transport: "tcp", echo: payload }
	}
}
