import "@libs/contract/arktype-global";

import { type AppConfig, appConfig, type TcpConfig, tcpConfig } from "@libs/core";
import { VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { type TcpOptions, Transport } from "@nestjs/microservices";
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
  app.setGlobalPrefix("api");
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: "1" });

  const { APP_HOST, APP_PORT } = app.get<unknown, AppConfig>(appConfig.KEY);
  const { PRODUCT_SERVICE_TCP_HOST, PRODUCT_SERVICE_TCP_PORT } = app.get<unknown, TcpConfig>(
    tcpConfig.KEY,
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Product Service API")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("swagger", app, documentFactory);

  const ms = app.connectMicroservice<TcpOptions>(
    {
      transport: Transport.TCP,
      options: {
        host: PRODUCT_SERVICE_TCP_HOST,
        port: PRODUCT_SERVICE_TCP_PORT,
      },
    },
    { deferInitialization: true },
  );

  // const ms = app.connectMicroservice<KafkaOptions>(app.get(KafkaService).options, {
  //   deferInitialization: true,
  // });
  registerMicroserviceLogging(ms);

  await app.startAllMicroservices();
  await app.listen(APP_PORT, APP_HOST);

  logger.log(`🔥 Swagger: http://${APP_HOST}:${APP_PORT}/swagger`);
  logger.log(`🟢 HTTP: http://${APP_HOST}:${APP_PORT}/api`);
  logger.log(`🔵 TCP: ${PRODUCT_SERVICE_TCP_HOST}:${PRODUCT_SERVICE_TCP_PORT}`);
}

await bootstrap();
