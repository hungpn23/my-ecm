import arkenv, { type } from "@arkenv/core";
import { NonEmptyString } from "@libs/contract";
import { type ConfigType, registerAs } from "@nestjs/config";

export const AwsConfig = type({
  AWS_REGION: NonEmptyString,
  AWS_ENDPOINT_URL: "string.url",
  AWS_ACCESS_KEY_ID: NonEmptyString,
  AWS_SECRET_ACCESS_KEY: NonEmptyString,
});

export const awsConfig = registerAs("aws", () => {
  const env = arkenv(AwsConfig);
  return {
    awsRegion: env.AWS_REGION,
    awsEndpointUrl: env.AWS_ENDPOINT_URL,
    awsAccessKeyId: env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  };
});

export type AwsConfig = ConfigType<typeof awsConfig>;
