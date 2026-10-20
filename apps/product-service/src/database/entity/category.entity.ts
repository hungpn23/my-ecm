import type { Category } from "@libs/contract";
import { AGGREGATE_TYPE, useBaseProps } from "@libs/core";
import { defineEntity, p, wrap, type Loaded } from "@mikro-orm/core";
// fallow-ignore-next-line circular-dependency
import { ProductEntity } from "./product.entity";

export const CategorySchema = defineEntity({
  name: AGGREGATE_TYPE.CATEGORY,
  properties: useBaseProps({
    name: p.string(),
    code: p.string().unique(),
    products: () => p.oneToMany(ProductEntity).mappedBy("category"),
  }),
});

export class CategoryEntity extends CategorySchema.class {
  toResponse(this: Loaded<CategoryEntity>): Category {
    return wrap(this).serialize();
  }

  toDetailResponse(this: Loaded<CategoryEntity>): Category {
    return wrap(this).serialize();
  }
}
CategorySchema.setClass(CategoryEntity);
