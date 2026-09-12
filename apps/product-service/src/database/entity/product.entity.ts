import { useBaseProps } from "@libs/core";
import { defineEntity, p } from "@mikro-orm/core";
import { PRODUCT_STATUS } from "@src/module/product/product.schema";
import { Category } from "./category.entity";

export const ProductSchema = defineEntity({
  name: "Product",
  properties: useBaseProps({
    name: p.string(),
    description: p.text().nullable(),
    price: p.decimal().precision(12).scale(2),
    status: p.enum(PRODUCT_STATUS),
    category: () => p.manyToOne(Category).lazyRef().inversedBy("products"),
  }),
});

export class Product extends ProductSchema.class {}
ProductSchema.setClass(Product);
