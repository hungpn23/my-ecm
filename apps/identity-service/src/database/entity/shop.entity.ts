import { AGGREGATE_TYPE, useBaseProps } from "@libs/core";
import { defineEntity, p } from "@mikro-orm/core";
// fallow-ignore-next-line circular-dependency
import { User } from "./user.entity";

export const ShopSchema = defineEntity({
  name: AGGREGATE_TYPE.SHOP,
  properties: useBaseProps({
    name: p.string(),
    description: p.text().nullable().lazy().ref(),
    owner: () => p.oneToOne(User).lazyRef(),
    users: () => p.oneToMany(User).mappedBy("shop"),
  }),
});

export class Shop extends ShopSchema.class {}
ShopSchema.setClass(Shop);
