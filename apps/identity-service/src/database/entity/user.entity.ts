import { AGGREGATE_TYPE, SHOP_ROLE, useBaseProps } from "@libs/core";
import { defineEntity, p } from "@mikro-orm/core";
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

export class User extends UserSchema.class {}
UserSchema.setClass(User);
