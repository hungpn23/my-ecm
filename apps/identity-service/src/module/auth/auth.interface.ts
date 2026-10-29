import type { Uuid } from "@libs/contract";

export interface PasswordProof {
  userId: Uuid;
  passwordHash: string;
}
