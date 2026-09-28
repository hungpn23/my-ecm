import { SendWelcomeEmailData, Welcome } from "@libs/email";
import { Injectable } from "@nestjs/common";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { createElement } from "react";
import { render } from "react-email";
import { EmailProvider } from "./provider/email-provider.abstract";

@Injectable()
export class EmailService {
  constructor(
    @InjectPinoLogger(EmailService.name) private readonly logger: PinoLogger,
    private readonly provider: EmailProvider,
  ) {}

  async sendWelcomeEmail(data: SendWelcomeEmailData) {
    await this.provider.send({
      to: data.to,
      subject: "Welcome to My Ecommerce",
      html: await render(createElement(Welcome)),
      text: "Welcome to My Ecommerce, your account is ready.",
    });

    this.logger.debug("Welcome email sent to %s", data.to);
  }
}
