import { type } from "arktype";

const BaseAuth = type({
  email: "string.email",
  password: "string >= 8",
});

export type BaseAuthDto = typeof BaseAuth.infer;
