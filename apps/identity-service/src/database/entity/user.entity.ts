import { AGGREGATE_TYPE, SHOP_ROLE, ShopRole, useBaseProps } from "@libs/core";
import { defineEntity, p } from "@mikro-orm/core";
import { BadRequestException, ConflictException } from "@nestjs/common";
import { verify } from "argon2";
import { Shop } from "./shop.entity";

export const UserSchema = defineEntity({
  name: AGGREGATE_TYPE.USER,
  properties: useBaseProps({
    email: p.string().unique(),
    password: p.string().lazy().ref().hidden(),
    shopRole: p.enum(SHOP_ROLE).nullable(),
    shop: () => p.manyToOne(Shop).nullable().lazyRef().inversedBy("users"),
  }),
});

export class User extends UserSchema.class {
  get membership() {
    if (!this.shop || !this.shopRole) return null;

    return {
      shopId: this.shop.id,
      shopRole: this.shopRole,
    };
  }

  async verifyPassword(password: string): Promise<void> {
    const current = await this.password.loadOrFail();
    const isMatch = await verify(current, password);
    if (!isMatch) throw new BadRequestException("Invalid credentials");
  }

  joinShop(shop: Shop, role: ShopRole) {
    if (this.shop || this.shopRole) {
      throw new ConflictException("User already belongs to a shop.");
    }

    this.shop = shop;
    this.shopRole = role;
  }
}
UserSchema.setClass(User);
