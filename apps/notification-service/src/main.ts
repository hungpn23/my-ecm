import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";

const HTTP_PORT = 8088;
const TCP_PORT = 8188;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: { host: "0.0.0.0", port: TCP_PORT },
  });

  await app.startAllMicroservices();
  await app.listen(HTTP_PORT, "0.0.0.0");

  console.log(`[notification-service] HTTP :${HTTP_PORT}  TCP :${TCP_PORT}`);
}

await bootstrap();
