import { type } from "arktype";

const Password = type("8 <= string <= 255").configure({ actual: () => "" });

export const ChangePassword = type({
  oldPassword: Password,
  newPassword: Password,
}).narrow((d, ctx) => {
  if (d.oldPassword === d.newPassword) {
    ctx.reject({
      expected: "different from oldPassword",
      actual: "",
      path: ["newPassword"],
    });
  }

  return true;
});
export type ChangePassword = typeof ChangePassword.infer;

export const BaseAuth = type({
  email: "string.email",
  password: Password,
});
export type BaseAuth = typeof BaseAuth.infer;

export const RefreshTokenBody = type({
  refreshToken: type("string").configure({ actual: () => "" }),
});
export type RefreshTokenBody = typeof RefreshTokenBody.infer;

export const TokenResponse = type({
  accessToken: "string",
  refreshToken: "string",
  expiresIn: "number.integer >= 1",
});
export type TokenResponse = typeof TokenResponse.inferIn;
