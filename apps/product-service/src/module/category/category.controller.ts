import { Endpoint } from "@libs/common";
import {
  CategoryResponse,
  CreateCategory,
  OffsetQuery,
  PaginatedCategoryResponse,
  UpdateCategory,
  Uuid,
} from "@libs/contract";
import { Body, Controller, Param, Query } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { CategoryService } from "./category.service";

@ApiBearerAuth()
@Controller("categories")
export class CategoryController {
  constructor(private readonly category: CategoryService) {}

  @Endpoint("POST", { request: CreateCategory, response: CategoryResponse })
  async create(@Body({ schema: CreateCategory }) body: CreateCategory): Promise<CategoryResponse> {
    return await this.category.create(body);
  }

  @Endpoint("GET", { query: OffsetQuery, response: PaginatedCategoryResponse })
  async find(
    @Query({ schema: OffsetQuery }) query: OffsetQuery,
  ): Promise<PaginatedCategoryResponse> {
    return await this.category.find(query);
  }

  @Endpoint("PATCH", {
    path: ":categoryId",
    request: UpdateCategory,
    response: CategoryResponse,
  })
  async update(
    @Param("categoryId", { schema: Uuid }) categoryId: Uuid,
    @Body({ schema: UpdateCategory }) body: UpdateCategory,
  ): Promise<CategoryResponse> {
    return await this.category.update(categoryId, body);
  }

  @Endpoint("DELETE", { path: ":categoryId" })
  async delete(@Param("categoryId", { schema: Uuid }) categoryId: Uuid): Promise<void> {
    await this.category.delete(categoryId);
  }
}
