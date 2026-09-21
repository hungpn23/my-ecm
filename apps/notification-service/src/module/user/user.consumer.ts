import { UserCreatedData } from "@libs/common";
import { KafkaTopic } from "@libs/core";
import { Controller } from "@nestjs/common";
import { Payload } from "@nestjs/microservices";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";

@Controller()
export class UserConsumer {
  constructor(@InjectPinoLogger(UserConsumer.name) private readonly logger: PinoLogger) {}

  @KafkaTopic("user.created")
  async handleUserCreated(@Payload({ schema: UserCreatedData }) data: UserCreatedData) {
    this.logger.info(data, "Received user created event");
  }
}
