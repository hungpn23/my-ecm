import { SendWelcomeMailData, Welcome } from "@libs/email";
import { Injectable } from "@nestjs/common";
import { Mailer } from "@nestjs/mail";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { createElement } from "react";
import { render } from "react-email";

@Injectable()
export class MailService {
  constructor(
    @InjectPinoLogger(MailService.name) private readonly logger: PinoLogger,
    private readonly mailer: Mailer,
  ) {}

  async sendWelcomeMail(data: SendWelcomeMailData) {
    const result = await this.mailer.send({
      to: data.to,
      subject: "Welcome to My Ecommerce",
      html: await render(createElement(Welcome)),
      text: "Welcome to My Ecommerce, your account is ready.",
    });

    this.logger.debug(
      { messageId: result.messageId, providerMessageId: result.providerMessageId },
      "Welcome email accepted by mail transport for %s",
      data.to,
    );
  }
}
