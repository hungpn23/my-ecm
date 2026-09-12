import { Injectable, NotImplementedException } from "@nestjs/common";
import type {
  CategoryResponse,
  CreateCategory,
  PaginatedCategoryResponse,
} from "./category.schema";

@Injectable()
export class CategoryService {
  constructor() {}

  async create(body: CreateCategory): Promise<CategoryResponse> {
    throw new NotImplementedException(body);
  }

  async findAll(): Promise<PaginatedCategoryResponse> {
    throw new NotImplementedException();
  }
}
