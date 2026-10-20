import type {
  NonNegativeDecimal,
  ProductDetail,
  Product,
  ProductStatus,
  Uuid,
} from "@libs/contract";
import { AGGREGATE_TYPE, useBaseProps } from "@libs/core";
import { defineEntity, p, wrap, type Loaded } from "@mikro-orm/core";
import { CategoryEntity } from "./category.entity";

export const ProductSchema = defineEntity({
  name: AGGREGATE_TYPE.PRODUCT,
  properties: useBaseProps({
    shopId: p.uuid().$type<Uuid>(),
    name: p.string(),
    description: p.text().nullable().lazy().ref(),
    price: p.decimal().precision(12).scale(2).$type<NonNegativeDecimal>(),
    status: p.string().$type<ProductStatus>(),
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
