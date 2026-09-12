import { EntityResponse, Paginated, Varchar } from "@libs/common";
import { type } from "arktype";

export const CreateCategory = type({
  name: Varchar,
  code: Varchar,
});
export type CreateCategory = typeof CreateCategory.infer;

export const CategoryResponse = EntityResponse.merge(CreateCategory);
export type CategoryResponse = typeof CategoryResponse.inferIn;

export const PaginatedCategoryResponse = Paginated(CategoryResponse);
export type PaginatedCategoryResponse = typeof PaginatedCategoryResponse.inferIn;
