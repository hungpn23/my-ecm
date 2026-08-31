import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { Profile } from "passport-google-oauth20";
import type { GoogleAuthenticatedRequest } from "./google.type";

export const GoogleProfile = createParamDecorator(
  (data: keyof Profile, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<GoogleAuthenticatedRequest>();
    const user = request.user; // user is set in the GoogleStrategy.validate() method after successful authentication

    return data ? user[data] : user;
  },
);
