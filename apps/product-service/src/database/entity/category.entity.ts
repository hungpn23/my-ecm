import { useBaseProps } from "@libs/core";
import { defineEntity, p } from "@mikro-orm/core";
import { Product } from "./product.entity";

export const CategorySchema = defineEntity({
  name: "Category",
  properties: useBaseProps({
    name: p.string(),
    code: p.string().unique(),
    products: () => p.oneToMany(Product).mappedBy("category"),
  }),
});

export class Category extends CategorySchema.class {}
CategorySchema.setClass(Category);
