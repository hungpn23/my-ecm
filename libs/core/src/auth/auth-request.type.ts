import type { AuthenticatedSeller, AuthenticatedUser } from "@libs/contract";
import type { Request } from "express";

export type AuthenticatedUserRequest<U extends AuthenticatedUser> = Omit<Request, "user"> & {
  user: U;
};

export type AuthenticatedSellerRequest<S extends AuthenticatedSeller> = Omit<Request, "user"> & {
  user: S;
};
