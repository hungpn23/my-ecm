import type { Product, User } from "@libs/contract";
import { Policy } from "@nestjs/authorization";

@Policy()
export class CheckoutPolicy {
  open(user: User, product: Product): boolean {
    return user.shopId !== product.shopId;
  }
}
