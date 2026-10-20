import { Endpoint } from "@libs/common";
import {
  Category,
  CreateCategory,
  OffsetQuery,
  PaginatedCategoryResponse,
  UpdateCategory,
  Uuid,
} from "@libs/contract";
import { Can } from "@nestjs/authorization";
import { Body, Controller, Param, Query } from "@nestjs/common";
import { CategoryPolicy } from "./category.policy";
import { CategoryService } from "./category.service";

@Controller("categories")
export class CategoryController {
  constructor(private readonly category: CategoryService) {}

  @Can(CategoryPolicy, "create")
  @Endpoint("POST", { request: CreateCategory, response: Category })
  async create(@Body({ schema: CreateCategory }) body: CreateCategory): Promise<Category> {
    return await this.category.create(body);
  }

  @Can.Anyone()
  @Endpoint("GET", { query: OffsetQuery, response: PaginatedCategoryResponse })
  async find(
    @Query({ schema: OffsetQuery }) query: OffsetQuery,
  ): Promise<PaginatedCategoryResponse> {
    return await this.category.find(query);
  }

  @Can(CategoryPolicy, "update")
  @Endpoint("PATCH", {
    path: ":categoryId",
    request: UpdateCategory,
    response: Category,
  })
  async update(
    @Param("categoryId", { schema: Uuid }) categoryId: Uuid,
    @Body({ schema: UpdateCategory }) body: UpdateCategory,
  ): Promise<Category> {
    return await this.category.update(categoryId, body);
  }

  @Can(CategoryPolicy, "delete")
  @Endpoint("DELETE", { path: ":categoryId" })
  async delete(@Param("categoryId", { schema: Uuid }) categoryId: Uuid): Promise<void> {
    await this.category.delete(categoryId);
  }
}
