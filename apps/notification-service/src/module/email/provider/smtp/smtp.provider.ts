import type { SendEmailData } from "@libs/email";
import { Inject } from "@nestjs/common";
import { createTransport, type Transporter } from "nodemailer";
import { AbstractEmailProvider } from "../abstract-email.provider";
import { SmtpConfig, smtpConfig } from "./smtp.config";

export class SmtpProvider extends AbstractEmailProvider {
  client: Transporter;
  from: string;

  constructor(@Inject(smtpConfig.KEY) private readonly config: SmtpConfig) {
    super();
    this.from = this.config.EMAIL_SENDER;
    this.client = createTransport({
      host: this.config.SMTP_HOST,
      port: this.config.SMTP_PORT,
      auth: {
        user: this.config.SMTP_USER,
        pass: this.config.SMTP_PASS,
      },
      secure: this.config.SMTP_PORT === 465,
    });
  }

  async send(data: SendEmailData): Promise<void> {
    await this.client.sendMail({
      ...data,
      from: this.from,
    });
  }
}
