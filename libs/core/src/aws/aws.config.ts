import arkenv, { type } from "@arkenv/core";
import { NonEmptyString } from "@libs/contract";
import { type ConfigType, registerAs } from "@nestjs/config";

export const AwsConfig = type({
  AWS_REGION: NonEmptyString,
  AWS_ENDPOINT_URL: "string.url",
  AWS_ACCESS_KEY_ID: NonEmptyString,
  AWS_SECRET_ACCESS_KEY: NonEmptyString,
});

export const awsConfig = registerAs("aws", () => arkenv(AwsConfig));

export type AwsConfig = ConfigType<typeof awsConfig>;
