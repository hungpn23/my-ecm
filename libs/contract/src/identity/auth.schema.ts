import { type } from "arktype";

const Password = type("string >= 8").configure({ actual: () => "" });

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
export type SignUp = BaseAuth;
export type SignIn = BaseAuth;

export const TokenResponse = type({
  accessToken: "string",
  refreshToken: "string",
});
export type TokenResponse = typeof TokenResponse.inferIn;
