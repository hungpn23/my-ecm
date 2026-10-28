import { type } from "arktype";

import { Paginated } from "../shared/common.schema";
import { EntityHttpResponse } from "../shared/entity-response.schema";
import { Varchar255 } from "../shared/string.schema";

export const CreateCategory = type({
  name: Varchar255,
  code: Varchar255,
});
export type CreateCategory = typeof CreateCategory.infer;

export const UpdateCategory = CreateCategory.partial();
export type UpdateCategory = typeof UpdateCategory.infer;

export const Category = EntityHttpResponse.merge(CreateCategory);
export type Category = typeof Category.inferIn;

export const PaginatedCategoryResponse = Paginated(Category);
export type PaginatedCategoryResponse = typeof PaginatedCategoryResponse.inferIn;
