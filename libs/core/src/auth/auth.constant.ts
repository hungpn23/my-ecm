export const PASSPORT_STRATEGY = {
  LOCAL: "local",
  JWT: "jwt",
  REFRESH: "refresh",
  GOOGLE: "google",
  GITHUB: "github",
} as const;

export const JWT_KIND = {
  ACCESS_TOKEN: "access-token",
  REFRESH_TOKEN: "refresh-token",
} as const;
