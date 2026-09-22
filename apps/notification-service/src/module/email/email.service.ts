import { SendEmailCommand, SESv2Client } from "@aws-sdk/client-sesv2";
import { awsConfig, type AwsConfig } from "@libs/core";
import { Welcome, WelcomeData } from "@libs/email";
import { Inject, Injectable } from "@nestjs/common";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { createElement } from "react";
import { render } from "react-email";
import { emailConfig, type EmailConfig } from "./email.config";

@Injectable()
export class EmailService {
  private readonly ses: SESv2Client;

  constructor(
    @InjectPinoLogger(EmailService.name) private readonly logger: PinoLogger,
    @Inject(emailConfig.KEY) private readonly emailConf: EmailConfig,
    @Inject(awsConfig.KEY) private readonly config: AwsConfig,
  ) {
    this.ses = new SESv2Client({
      region: this.config.AWS_REGION,
      endpoint: this.config.AWS_ENDPOINT_URL,
      credentials: {
        accessKeyId: this.config.AWS_ACCESS_KEY_ID,
        secretAccessKey: this.config.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async sendWelcomeEmail(data: WelcomeData) {
    const result = await this.ses.send(
      new SendEmailCommand({
        FromEmailAddress: this.emailConf.EMAIL_SENDER,
        Destination: { ToAddresses: [data.to] },
        Content: {
          Simple: {
            Subject: { Data: "Welcome to My Ecommerce" },
            Body: {
              Html: { Data: await render(createElement(Welcome)) },
              Text: { Data: `Welcome to My Ecommerce, your account is ready.` },
            },
          },
        },
      }),
    );

    this.logger.debug(result, "Welcome email sent to %s", data.to);

    return result;
  }
}
