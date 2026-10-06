import { type } from "arktype";
import { Paginated, Varchar255 } from "../shared/common.schema";
import { EntityResponse } from "../shared/entity-response.schema";

export const CreateCategory = type({
  name: Varchar255,
  code: Varchar255,
});
export type CreateCategory = typeof CreateCategory.infer;

export const UpdateCategory = CreateCategory.partial();
export type UpdateCategory = typeof UpdateCategory.infer;

export const CategoryResponse = EntityResponse.merge(CreateCategory);
export type CategoryResponse = typeof CategoryResponse.inferIn;

export const PaginatedCategoryResponse = Paginated(CategoryResponse);
export type PaginatedCategoryResponse = typeof PaginatedCategoryResponse.inferIn;
