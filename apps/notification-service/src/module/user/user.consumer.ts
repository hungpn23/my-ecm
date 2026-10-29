import { UserCreatedPayload } from "@libs/contract";
import type { MicroserviceEvent } from "@libs/core";
import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";

import { EmailService } from "#internal/module/email/email.service";

@Controller()
export class UserConsumer {
  constructor(
    @InjectPinoLogger(UserConsumer.name) private readonly logger: PinoLogger,
    private readonly email: EmailService,
  ) {}

  @EventPattern<MicroserviceEvent>("user.created")
  async handleUserCreated(@Payload({ schema: UserCreatedPayload }) data: UserCreatedPayload): Promise<void> {
    await this.email.sendWelcomeEmail({ to: data.email });

    this.logger.info(data, "Consumed user created event");
  }
}
