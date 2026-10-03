import { MailService } from "#internal/module/mail/mail.service";
import { UserCreatedData } from "@libs/common";
import { KafkaEvent } from "@libs/core";
import { Controller } from "@nestjs/common";
import { Payload } from "@nestjs/microservices";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";

@Controller()
export class UserConsumer {
  constructor(
    @InjectPinoLogger(UserConsumer.name) private readonly logger: PinoLogger,
    private readonly mailService: MailService,
  ) {}

  @KafkaEvent("user.created")
  async handleUserCreated(@Payload({ schema: UserCreatedData }) data: UserCreatedData) {
    await this.mailService.sendWelcomeMail({ to: data.email });

    this.logger.info(data, "Consumed user created event");
  }
}
