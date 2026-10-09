import { ROLE, SHOP_ROLE, ShopRole, type UserResponse } from "@libs/contract";
import { AGGREGATE_TYPE, useBaseProps } from "@libs/core";
import { defineEntity, p, wrap, type Loaded } from "@mikro-orm/core";
import { ConflictException } from "@nestjs/common";
import { Shop } from "./shop.entity";

export const UserSchema = defineEntity({
  name: AGGREGATE_TYPE.USER,
  properties: useBaseProps({
    email: p.string().unique(),
    password: p.string().lazy().ref().hidden(),
    role: p.enum(ROLE),
    shopRole: p.enum(SHOP_ROLE).nullable(),
    shop: () => p.manyToOne(Shop).nullable().lazyRef().inversedBy("users"),
  }),
});

export class User extends UserSchema.class {
  getMembership(this: Loaded<User, "shop">) {
    if (!this.shop || !this.shopRole) return { shopId: null, shopRole: null };

    return {
      shopId: this.shop.id,
      shopRole: this.shopRole,
    };
  }

  joinShop(shop: Shop, role: ShopRole) {
    if (this.shop || this.shopRole) {
      throw new ConflictException("User already belongs to a shop.");
    }

    this.shop = shop;
    this.shopRole = role;
  }

  toResponse(this: Loaded<User, "shop">): UserResponse {
    const user = wrap(this).serialize({
      exclude: ["shop", "shopRole", "password"],
    });

    return {
      ...user,
      ...this.getMembership(),
    };
  }
}
UserSchema.setClass(User);
