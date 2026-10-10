import { EmailService } from "#internal/module/email/email.service";
import { UserCreatedData } from "@libs/contract";
import { KafkaEvent } from "@libs/core";
import { Controller } from "@nestjs/common";
import { Payload } from "@nestjs/microservices";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";

@Controller()
export class UserConsumer {
  constructor(
    @InjectPinoLogger(UserConsumer.name) private readonly logger: PinoLogger,
    private readonly email: EmailService,
  ) {}

  /** @ignore Currently unused. */
  @KafkaEvent("user.created")
  async handleUserCreated(@Payload({ schema: UserCreatedData }) data: UserCreatedData) {
    await this.email.sendWelcomeEmail({ to: data.email });

    this.logger.info(data, "Consumed user created event");
  }
}
