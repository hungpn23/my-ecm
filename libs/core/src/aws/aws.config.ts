import { type ConfigType, registerAs } from "@nestjs/config";
import { createEnv, type } from "arkenv";

export const AwsConfig = type({
  AWS_REGION: "string >= 1",
  AWS_ENDPOINT_URL: "string.url",
  AWS_ACCESS_KEY_ID: "string >= 1",
  AWS_SECRET_ACCESS_KEY: "string >= 1",
});

export const awsConfig = registerAs("aws", () => createEnv(AwsConfig));

export type AwsConfig = ConfigType<typeof awsConfig>;
