import { Controller, Get, Inject } from "@nestjs/common";
import { ClientProxy, MessagePattern } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Controller()
export class AppController {
	constructor(@Inject("USER_SERVICE") private readonly userClient: ClientProxy) {}

	@Get()
	root() {
		return { service: "auth-service", transport: "http", port: 8080 };
	}

	@Get("ping-other")
	async pingOther() {
		const reply = await firstValueFrom(
			this.userClient.send<unknown>("ping", { from: "auth-service" }),
		);
		return { service: "auth-service", calledOverTcp: reply };
	}

	@MessagePattern("ping")
	onPing(payload: unknown) {
		return { service: "auth-service", transport: "tcp", echo: payload };
	}
}
