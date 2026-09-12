import { Endpoint } from "@libs/common";
import { Body, Controller } from "@nestjs/common";
import { CategoryResponse, CreateCategory, PaginatedCategoryResponse } from "./category.schema";
import { CategoryService } from "./category.service";

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
  async findAll(): Promise<PaginatedCategoryResponse> {
    return await this.categoryService.findAll();
  }
}
