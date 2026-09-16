import { getAppConfig } from "@libs/core";
import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger } from "nestjs-pino";
import "reflect-metadata";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    routeConflictPolicy: { duplicate: "error", shadow: "error" },
  });

  const logger = app.get(Logger);
  app.useLogger(logger);

  const { APP_HOST, APP_PORT, APP_PORT_TCP } = getAppConfig();

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Identity Service API")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("swagger", app, documentFactory);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: { host: APP_HOST, port: APP_PORT_TCP },
  });

  await app.startAllMicroservices();
  await app.listen(APP_PORT, APP_HOST);

  logger.log(`Swagger: http://${APP_HOST}:${APP_PORT}/swagger`);
  logger.log(`TCP: ${APP_HOST}:${APP_PORT_TCP}`);
}

await bootstrap();
