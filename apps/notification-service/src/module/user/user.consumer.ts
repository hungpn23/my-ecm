import { UserCreatedData } from "@libs/common";
import { KafkaEvent } from "@libs/core";
import { Controller } from "@nestjs/common";
import { Payload } from "@nestjs/microservices";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { EmailService } from "../email/email.service";

@Controller()
export class UserConsumer {
  constructor(
    @InjectPinoLogger(UserConsumer.name) private readonly logger: PinoLogger,
    private readonly emailService: EmailService,
  ) {}

  @KafkaEvent("user.created")
  async handleUserCreated(@Payload({ schema: UserCreatedData }) data: UserCreatedData) {
    await this.emailService.sendWelcomeEmail({ to: data.email });

    this.logger.info(data, "Consumed user created event");
  }
}
