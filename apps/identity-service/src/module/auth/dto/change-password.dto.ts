import { type } from "arktype";

const ChangePassword = type({
  oldPassword: "string >= 8",
  newPassword: "string >= 8",
});

export type ChangePasswordDto = typeof ChangePassword;
