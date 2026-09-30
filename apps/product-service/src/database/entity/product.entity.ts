import { type ProductStatus } from "#internal/module/product/product.schema";
import type { Uuid } from "@libs/common";
import { AGGREGATE_TYPE, useBaseProps } from "@libs/core";
import { defineEntity, p } from "@mikro-orm/core";
import { Category } from "./category.entity";

export const ProductSchema = defineEntity({
  name: AGGREGATE_TYPE.PRODUCT,
  properties: useBaseProps({
    shopId: p.uuid().$type<Uuid>(),
    name: p.string(),
    description: p.text().nullable().lazy().ref(),
    price: p.decimal().precision(12).scale(2),
    status: p.string().$type<ProductStatus>(),
    category: () => p.manyToOne(Category).lazyRef().inversedBy("products"),
  }),
});

export class Product extends ProductSchema.class {}
ProductSchema.setClass(Product);
