import { SendWelcomeEmailData } from "@libs/contract";
import { Welcome } from "@libs/email";
import { Injectable } from "@nestjs/common";
import { Mailer } from "@nestjs/mail";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { createElement } from "react";
import { render } from "react-email";

@Injectable()
export class EmailService {
  constructor(
    @InjectPinoLogger(EmailService.name) private readonly logger: PinoLogger,
    private readonly mailer: Mailer,
  ) {}

  async sendWelcomeEmail(data: SendWelcomeEmailData) {
    const result = await this.mailer.send({
      to: data.to,
      subject: "Welcome to My Ecommerce",
      html: await render(createElement(Welcome)),
      text: "Welcome to My Ecommerce, your account is ready.",
    });

    this.logger.debug(
      { messageId: result.messageId, providerMessageId: result.providerMessageId },
      "Welcome email accepted by email transport for %s",
      data.to,
    );
  }
}
