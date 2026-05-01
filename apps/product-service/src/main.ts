import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";

const HTTP_PORT = 8081;
const TCP_PORT = 8181;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: { host: "0.0.0.0", port: TCP_PORT },
  });

  await app.startAllMicroservices();
  await app.listen(HTTP_PORT, "0.0.0.0");

  console.log(`[product-service] HTTP :${HTTP_PORT}  TCP :${TCP_PORT}`);
}

await bootstrap();
