import "@libs/contract/arktype-global";

import { ArktypeValidationPipe, RpcExceptionFilter } from "@libs/common";
import { type AppConfig, appConfig, type TcpConfig, tcpConfig } from "@libs/core";
import { VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { type TcpOptions, Transport } from "@nestjs/microservices";
import { DocumentBuilder, type OpenAPIObject, SwaggerModule } from "@nestjs/swagger";
import { Logger, registerMicroserviceLogging } from "nestjs-pino";
import "reflect-metadata";
import { AppModule, ObserveInstrument } from "./app.module";

async function bootstrap(): Promise<void> {
  if (!ObserveInstrument) throw new Error("Observe instrument is unavailable");

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    instrument: ObserveInstrument,
    routeConflictPolicy: { duplicate: "error", shadow: "error" },
  });

  app.enableShutdownHooks();

  const logger = app.get(Logger);
  app.useLogger(logger);
  app.setGlobalPrefix("api");
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: "1" });

  const { appHost, appPort } = app.get<unknown, AppConfig>(appConfig.KEY);
  const { identityServiceTcpHost, identityServiceTcpPort } = app.get<unknown, TcpConfig>(tcpConfig.KEY);

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Identity Service API")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const documentFactory = (): OpenAPIObject => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("swagger", app, documentFactory);

  const ms = app.connectMicroservice<TcpOptions>(
    {
      transport: Transport.TCP,
      options: {
        host: identityServiceTcpHost,
        port: identityServiceTcpPort,
      },
    },
    { deferInitialization: true },
  );

  registerMicroserviceLogging(ms);
  ms.useGlobalPipes(new ArktypeValidationPipe());
  ms.useGlobalFilters(new RpcExceptionFilter());

  await app.startAllMicroservices();
  await app.listen(appPort, appHost);

  logger.log(`🔥 Swagger: http://${appHost}:${appPort}/swagger`);
  logger.log(`🟢 HTTP: http://${appHost}:${appPort}/api`);
  logger.log(`🔵 TCP: ${identityServiceTcpHost}:${identityServiceTcpPort}`);
}

await bootstrap();
