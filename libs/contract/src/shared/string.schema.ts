import { type } from "arktype";

export const Uuid = type("string.uuid.v7");
export type Uuid = typeof Uuid.infer;

export const NonEmptyString = type("string >= 1").brand("NonEmptyString");
export type NonEmptyString = typeof NonEmptyString.infer;

export const Varchar255 = type("string <= 255");
export type Varchar255 = typeof Varchar255.infer;
