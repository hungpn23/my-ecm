import { appConfig, KafkaOptionsFactory } from "@libs/core";
import { NestFactory } from "@nestjs/core";
import { type KafkaOptions } from "@nestjs/microservices";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger, registerMicroserviceLogging } from "nestjs-pino";
import "reflect-metadata";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    routeConflictPolicy: { duplicate: "error", shadow: "error" },
  });

  app.enableShutdownHooks();

  const logger = app.get(Logger);
  app.useLogger(logger);

  const { APP_HOST, APP_PORT } = app.get(appConfig.KEY);

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Identity Service API")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("swagger", app, documentFactory);

  const ms = app.connectMicroservice<KafkaOptions>(
    app.get(KafkaOptionsFactory).createClientOptions(),
    { deferInitialization: true },
  );
  registerMicroserviceLogging(ms);

  await app.startAllMicroservices();
  await app.listen(APP_PORT, APP_HOST);

  logger.log(`Swagger: http://${APP_HOST}:${APP_PORT}/swagger`);
}

await bootstrap();
