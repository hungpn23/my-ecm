import { MikroORM } from "@mikro-orm/core";
import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { Logger } from "nestjs-pino";
import "reflect-metadata";
import { AppModule } from "./app.module";

const HTTP_PORT = 8080;
const TCP_PORT = 8180;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    routeConflictPolicy: { duplicate: "error", shadow: "error" },
  });

  const logger = app.get(Logger);
  app.useLogger(logger);

  const orm = app.get(MikroORM);
  await orm.schema.update();

  app.connectMicroservice({
    transport: Transport.TCP,
    options: { host: "0.0.0.0", port: TCP_PORT },
  });

  await app.startAllMicroservices();
  await app.listen(HTTP_PORT, "0.0.0.0");

  logger.log(`[identity-service] HTTP :${HTTP_PORT}  TCP :${TCP_PORT}`);
}

await bootstrap();
