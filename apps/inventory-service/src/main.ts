import "reflect-metadata"
import { NestFactory } from "@nestjs/core"
import { Transport } from "@nestjs/microservices"
import { AppModule } from "./app.module.js"

const HTTP_PORT = 8082
const TCP_PORT = 8182

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.connectMicroservice({
		transport: Transport.TCP,
		options: { host: "0.0.0.0", port: TCP_PORT },
	})

	await app.startAllMicroservices()
	await app.listen(HTTP_PORT, "0.0.0.0")

	console.log(`[inventory-service] HTTP :${HTTP_PORT}  TCP :${TCP_PORT}`)
}

bootstrap()
