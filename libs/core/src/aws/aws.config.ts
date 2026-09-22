import { type ConfigType, registerAs } from "@nestjs/config";
import arkenv from "arkenv";

export const awsConfig = registerAs("aws", () =>
  arkenv({
    AWS_REGION: "string >= 1",
    AWS_ENDPOINT_URL: "string.url",
    AWS_ACCESS_KEY_ID: "string >= 1",
    AWS_SECRET_ACCESS_KEY: "string >= 1",
  }),
);

export type AwsConfig = ConfigType<typeof awsConfig>;
