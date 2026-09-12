import { Endpoint } from "@libs/common";
import { Body, Controller } from "@nestjs/common";
import {
  CategoryResponseSchema,
  CreateCategorySchema,
  PaginatedCategoryResponseSchema,
  type CategoryResponse,
  type CreateCategory,
  type PaginatedCategoryResponse,
} from "./category.schema";
import { CategoryService } from "./category.service";

@Controller("categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Endpoint({
    method: "POST",
    request: CreateCategorySchema,
    response: CategoryResponseSchema,
  })
  async create(
    @Body({ schema: CreateCategorySchema }) body: CreateCategory,
  ): Promise<CategoryResponse> {
    return await this.categoryService.create(body);
  }

  @Endpoint({
    method: "GET",
    response: PaginatedCategoryResponseSchema,
  })
  async findAll(): Promise<PaginatedCategoryResponse> {
    return await this.categoryService.findAll();
  }
}
