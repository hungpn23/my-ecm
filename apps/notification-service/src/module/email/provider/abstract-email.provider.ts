import type { SESv2Client } from "@aws-sdk/client-sesv2";
import type { SendEmailData } from "@libs/email";
import type { Transporter } from "nodemailer";

export abstract class AbstractEmailProvider {
  abstract client: SESv2Client | Transporter;
  abstract from: string;
  abstract send(data: SendEmailData): Promise<void>;
}
