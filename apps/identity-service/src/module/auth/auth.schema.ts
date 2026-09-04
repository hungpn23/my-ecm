import { type } from "arktype";

export const ChangePasswordSchema = type({
  oldPassword: "string >= 8",
  newPassword: "string >= 8",
});

export type ChangePassword = typeof ChangePasswordSchema.infer;

export const BaseAuthSchema = type({
  email: "string.email",
  password: "string >= 8",
});

export type BaseAuth = typeof BaseAuthSchema.infer;
export type SignUp = BaseAuth;
export type SignIn = BaseAuth;

export const TokenResponseSchema = type({
  accessToken: "string",
  refreshToken: "string",
});

export type TokenResponse = typeof TokenResponseSchema.inferIn;
