import { type } from "arktype";

const RefreshToken = type({
  refreshToken: "string",
});

export type RefreshTokenDto = typeof RefreshToken;
