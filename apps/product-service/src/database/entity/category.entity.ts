import type { Category } from "@libs/contract";
import { ENTITY_NAME, useBaseProps } from "@libs/core";
import { defineEntity, type Loaded, p, wrap } from "@mikro-orm/core";

// fallow-ignore-next-line circular-dependency
import { ProductEntity } from "./product.entity";

export const CategorySchema = defineEntity({
  name: ENTITY_NAME.CATEGORY,
  tableName: "category",
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
