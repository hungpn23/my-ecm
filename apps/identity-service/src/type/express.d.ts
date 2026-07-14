import { JwtType } from "@libs/core";

declare global {
  namespace Express {
    interface User {
      userId: string;
      sessionId: string;
      jwtType: JwtType;
    }

    interface MayBeAuthenticatedRequest {
      user?: User;
    }
  }
}
export {};
