import { JwtAuthGuard } from "@libs/core";
import { MikroORM } from "@mikro-orm/core";
import { NestFactory, Reflector } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { Logger } from "nestjs-pino";
import "reflect-metadata";
import { AppModule } from "./app.module";

const HTTP_PORT = 8080;
const TCP_PORT = 8180;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const reflector = app.get(Reflector);
  const logger = app.get(Logger);

  const orm = app.get(MikroORM);
  await orm.schema.update();

  app.useLogger(logger);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  app.connectMicroservice({
    transport: Transport.TCP,
    options: { host: "0.0.0.0", port: TCP_PORT },
  });

  await app.startAllMicroservices();
  await app.listen(HTTP_PORT, "0.0.0.0");

  logger.log(`[identity-service] HTTP :${HTTP_PORT}  TCP :${TCP_PORT}`);
}

await bootstrap();
