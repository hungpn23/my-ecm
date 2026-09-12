import { EntityResponseSchema, Paginated, VarcharSchema } from "@libs/common";
import { type } from "arktype";

export const CreateCategorySchema = type({
  name: VarcharSchema,
  code: VarcharSchema,
});
export type CreateCategory = typeof CreateCategorySchema.infer;

export const CategoryResponseSchema = EntityResponseSchema.merge(CreateCategorySchema);
export type CategoryResponse = typeof CategoryResponseSchema.infer;

export const PaginatedCategoryResponseSchema = Paginated(CategoryResponseSchema);
export type PaginatedCategoryResponse = typeof PaginatedCategoryResponseSchema.infer;

// export const CategoriesResponseSchema = CategoryResponseSchema.array();
// export type CategoriesResponse = typeof CategoriesResponseSchema.infer;
