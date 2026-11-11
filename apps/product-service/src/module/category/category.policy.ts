import type { NullableUser } from "@libs/contract";
import { Policy } from "@nestjs/authorization";

@Policy()
export class CategoryPolicy {
  create(user: NullableUser): boolean {
    return user?.role === "SYSTEM_ADMIN";
  }

  update(user: NullableUser): boolean {
    return user?.role === "SYSTEM_ADMIN";
  }

  delete(user: NullableUser): boolean {
    return user?.role === "SYSTEM_ADMIN";
  }
}
