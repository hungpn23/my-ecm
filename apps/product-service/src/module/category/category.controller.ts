import { Endpoint, OffsetQuery, Uuid } from "@libs/common";
import { Body, Controller, Param, Query } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import {
  CategoryResponse,
  CreateCategory,
  PaginatedCategoryResponse,
  UpdateCategory,
} from "./category.schema";
import { CategoryService } from "./category.service";

@ApiBearerAuth()
@Controller("categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Endpoint("POST", { request: CreateCategory, response: CategoryResponse })
  async create(@Body({ schema: CreateCategory }) body: CreateCategory): Promise<CategoryResponse> {
    return await this.categoryService.create(body);
  }

  @Endpoint("GET", { query: OffsetQuery, response: PaginatedCategoryResponse })
  async find(
    @Query({ schema: OffsetQuery }) query: OffsetQuery,
  ): Promise<PaginatedCategoryResponse> {
    return await this.categoryService.find(query);
  }

  @Endpoint("PATCH", {
    path: ":categoryId",
    request: UpdateCategory,
    response: CategoryResponse,
  })
  async update(
    @Param("categoryId", { schema: Uuid }) categoryId: string,
    @Body({ schema: UpdateCategory }) body: UpdateCategory,
  ): Promise<CategoryResponse> {
    return await this.categoryService.update(categoryId, body);
  }

  @Endpoint("DELETE", { path: ":categoryId" })
  async delete(@Param("categoryId", { schema: Uuid }) categoryId: string): Promise<void> {
    await this.categoryService.delete(categoryId);
  }
}
