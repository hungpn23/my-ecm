import type { ProductDetailResponse, ProductResponse, ProductStatus, Uuid } from "@libs/contract";
import { AGGREGATE_TYPE, useBaseProps } from "@libs/core";
import { defineEntity, p, wrap, type Loaded } from "@mikro-orm/core";
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

export class Product extends ProductSchema.class {
  toResponse(this: Loaded<Product, "category">): ProductResponse {
    const { category, ...data } = wrap(this).serialize({
      populate: ["category"],
    });

    return {
      ...data,
      categoryId: category.id,
    };
  }

  toDetailResponse(this: Loaded<Product, "description" | "category">): ProductDetailResponse {
    const { category, ...data } = wrap(this).serialize({
      populate: ["description", "category"],
    });

    return {
      ...data,
      categoryId: category.id,
    };
  }
}
ProductSchema.setClass(Product);
