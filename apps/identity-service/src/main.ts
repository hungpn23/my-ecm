import { JwtAuthGuard } from "@libs/core";
import { MikroORM } from "@mikro-orm/core";
import { Logger } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import "reflect-metadata";
import { AppModule } from "./app.module";

const HTTP_PORT = 8080;
const TCP_PORT = 8180;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);

  const orm = app.get(MikroORM);
  await orm.schema.update();

  app.useGlobalGuards(new JwtAuthGuard(reflector));

  app.connectMicroservice({
    transport: Transport.TCP,
    options: { host: "0.0.0.0", port: TCP_PORT },
  });

  await app.startAllMicroservices();
  await app.listen(HTTP_PORT, "0.0.0.0");

  Logger.log(`[identity-service] HTTP :${HTTP_PORT}  TCP :${TCP_PORT}`);
}

await bootstrap();
