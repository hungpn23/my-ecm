import type { User } from "@libs/contract";
import { Policy } from "@nestjs/authorization";

@Policy()
export class CategoryPolicy {
  create(user: User | null) {
    return user?.role === "SYSTEM_ADMIN";
  }

  update(user: User | null) {
    return user?.role === "SYSTEM_ADMIN";
  }

  delete(user: User | null) {
    return user?.role === "SYSTEM_ADMIN";
  }
}
