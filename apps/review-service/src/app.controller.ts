import { Controller, Get } from "@nestjs/common"
import { MessagePattern } from "@nestjs/microservices"

@Controller()
export class AppController {
	@Get()
	root() {
		return { service: "review-service", transport: "http", port: 8090 }
	}

	@MessagePattern("ping")
	onPing(payload: unknown) {
		return { service: "review-service", transport: "tcp", echo: payload }
	}
}
