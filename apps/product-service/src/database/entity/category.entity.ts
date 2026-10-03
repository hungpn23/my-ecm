import type { CategoryResponse } from "#internal/module/category/category.schema";
import { AGGREGATE_TYPE, useBaseProps } from "@libs/core";
import { defineEntity, p, wrap, type Loaded } from "@mikro-orm/core";
// fallow-ignore-next-line circular-dependency
import { Product } from "./product.entity";

export const CategorySchema = defineEntity({
  name: AGGREGATE_TYPE.CATEGORY,
  properties: useBaseProps({
    name: p.string(),
    code: p.string().unique(),
    products: () => p.oneToMany(Product).mappedBy("category"),
  }),
});

export class Category extends CategorySchema.class {
  toResponse(this: Loaded<Category>): CategoryResponse {
    return wrap(this).serialize();
  }

  toDetailResponse(this: Loaded<Category>): CategoryResponse {
    return wrap(this).serialize();
  }
}
CategorySchema.setClass(Category);
