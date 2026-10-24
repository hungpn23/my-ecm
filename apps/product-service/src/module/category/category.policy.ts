import type { User } from "@libs/contract";
import { Policy } from "@nestjs/authorization";

@Policy()
export class CategoryPolicy {
  create(user: User | null): boolean {
    return user?.role === "SYSTEM_ADMIN";
  }

  update(user: User | null): boolean {
    return user?.role === "SYSTEM_ADMIN";
  }

  delete(user: User | null): boolean {
    return user?.role === "SYSTEM_ADMIN";
  }
}
