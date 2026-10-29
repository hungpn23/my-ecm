import { type NonNegativeDecimal, type Product, PRODUCT_STATUSES, type ProductDetail, type Uuid } from "@libs/contract";
import { ENTITY_NAME, useBaseProps } from "@libs/core";
import { defineEntity, type Loaded, p, wrap } from "@mikro-orm/core";

import { CategoryEntity } from "./category.entity";

export const ProductSchema = defineEntity({
  name: ENTITY_NAME.PRODUCT,
  tableName: "product",
  properties: useBaseProps({
    shopId: p.uuid().$type<Uuid>(),
    name: p.string(),
    description: p.text().nullable().lazy().ref(),
    price: p.decimal().precision(12).scale(2).$type<NonNegativeDecimal>(),
    status: p.enum(PRODUCT_STATUSES),
    category: () => p.manyToOne(CategoryEntity).lazyRef().inversedBy("products"),
  }),
});

export class ProductEntity extends ProductSchema.class {
  toResponse(this: Loaded<ProductEntity, "category">): Product {
    const { category, ...data } = wrap(this).serialize({
      populate: ["category"],
    });

    return {
      ...data,
      categoryId: category.id,
    };
  }

  toDetailResponse(this: Loaded<ProductEntity, "description" | "category">): ProductDetail {
    const { category, ...data } = wrap(this).serialize({
      populate: ["description", "category"],
    });

    return {
      ...data,
      categoryId: category.id,
    };
  }
}
ProductSchema.setClass(ProductEntity);
