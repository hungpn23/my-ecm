import { JwtPayload } from "../jwt/jwt-payload.type";
import { JwtType } from "../jwt/jwt-type.enum";

export type AuthenticatedUser = JwtPayload & {
  userId: string;
  sessionId: string;
  jwtType: JwtType;
};
