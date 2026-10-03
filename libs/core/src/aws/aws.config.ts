import { NonEmptyString } from "@libs/common";
import { type ConfigType, registerAs } from "@nestjs/config";
import { createEnv, type } from "arkenv";

export const AwsConfig = type({
  AWS_REGION: NonEmptyString,
  AWS_ENDPOINT_URL: "string.url",
  AWS_ACCESS_KEY_ID: NonEmptyString,
  AWS_SECRET_ACCESS_KEY: NonEmptyString,
});

export const awsConfig = registerAs("aws", () => createEnv(AwsConfig));

export type AwsConfig = ConfigType<typeof awsConfig>;
