import { AGGREGATE_TYPE, useBaseProps } from "@libs/core";
import { defineEntity, p } from "@mikro-orm/core";
import { type ProductStatus } from "#internal/module/product/product.schema";
import { Category } from "./category.entity";

export const ProductSchema = defineEntity({
  name: AGGREGATE_TYPE.PRODUCT,
  properties: useBaseProps({
    name: p.string(),
    description: p.text().nullable(),
    price: p.decimal().precision(12).scale(2),
    status: p.string().$type<ProductStatus>(),
    category: () => p.manyToOne(Category).lazyRef().inversedBy("products"),
  }),
});

export class Product extends ProductSchema.class {}
ProductSchema.setClass(Product);
