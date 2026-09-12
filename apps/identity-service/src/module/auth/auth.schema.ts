import { type } from "arktype";

export const ChangePassword = type({
  oldPassword: "string >= 8",
  newPassword: "string >= 8",
});
export type ChangePassword = typeof ChangePassword.infer;

export const BaseAuth = type({
  email: "string.email",
  password: "string >= 8",
});
export type BaseAuth = typeof BaseAuth.infer;
export type SignUp = BaseAuth;
export type SignIn = BaseAuth;

export const TokenResponse = type({
  accessToken: "string",
  refreshToken: "string",
});
export type TokenResponse = typeof TokenResponse.inferIn;
