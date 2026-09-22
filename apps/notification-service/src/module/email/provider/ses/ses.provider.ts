import { SendEmailCommand, SESv2Client } from "@aws-sdk/client-sesv2";
import type { SendEmailData } from "@libs/email";
import { Inject } from "@nestjs/common";
import { AbstractEmailProvider } from "../abstract-email.provider";
import { sesConfig, SesConfig } from "./ses.config";

export class SesProvider extends AbstractEmailProvider {
  client: SESv2Client;
  from: string;

  constructor(@Inject(sesConfig.KEY) private readonly config: SesConfig) {
    super();
    this.from = this.config.EMAIL_SENDER;
    this.client = new SESv2Client({
      region: this.config.AWS_REGION,
      endpoint: this.config.AWS_ENDPOINT_URL,
      credentials: {
        accessKeyId: this.config.AWS_ACCESS_KEY_ID,
        secretAccessKey: this.config.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async send(data: SendEmailData) {
    await this.client.send(
      new SendEmailCommand({
        FromEmailAddress: this.from,
        Destination: { ToAddresses: [data.to] },
        Content: {
          Simple: {
            Subject: { Data: data.subject },
            Body: {
              Html: { Data: data.html },
              Text: { Data: data.text },
            },
          },
        },
      }),
    );
  }
}
