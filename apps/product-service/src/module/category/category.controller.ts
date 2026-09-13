import { Endpoint, OffsetQuery } from "@libs/common";
import { Body, Controller, Query } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { CategoryResponse, CreateCategory, PaginatedCategoryResponse } from "./category.schema";
import { CategoryService } from "./category.service";

@ApiBearerAuth()
@Controller("categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Endpoint({
    method: "POST",
    request: CreateCategory,
    response: CategoryResponse,
  })
  async create(@Body({ schema: CreateCategory }) body: CreateCategory): Promise<CategoryResponse> {
    return await this.categoryService.create(body);
  }

  @Endpoint({
    method: "GET",
    response: PaginatedCategoryResponse,
  })
  async find(
    @Query({ schema: OffsetQuery }) query: OffsetQuery,
  ): Promise<PaginatedCategoryResponse> {
    return await this.categoryService.find(query);
  }
}
