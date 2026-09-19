import { getAppConfig } from "@libs/core";
import { NestFactory } from "@nestjs/core";
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

  const { APP_HOST, APP_PORT } = getAppConfig();

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Product Service API")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("swagger", app, documentFactory);

  await app.listen(APP_PORT, APP_HOST);

  logger.log(`Swagger: http://${APP_HOST}:${APP_PORT}/swagger`);
}

await bootstrap();
