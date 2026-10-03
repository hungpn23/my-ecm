import { Category } from "#internal/database/entity/index";
import { deepMerge, Uuid, type OffsetQuery } from "@libs/common";
import { BaseService } from "@libs/core";
import { Transactional } from "@mikro-orm/decorators/legacy";
import { InjectRepository } from "@mikro-orm/nestjs";
import {
  EntityManager,
  EntityRepository,
  wrap,
  type FilterQuery,
  type Loaded,
} from "@mikro-orm/postgresql";
import { Injectable, NotFoundException } from "@nestjs/common";
import type {
  CategoryResponse,
  CreateCategory,
  PaginatedCategoryResponse,
  UpdateCategory,
} from "./category.schema";

@Injectable()
export class CategoryService extends BaseService<Category> {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Category)
    private readonly categoryRepo: EntityRepository<Category>,
  ) {
    super();
  }

  @Transactional()
  async create(body: CreateCategory): Promise<CategoryResponse> {
    const category = this.categoryRepo.create(body);

    return this._toResponse(category);
  }

  async find(query: OffsetQuery): Promise<PaginatedCategoryResponse> {
    const { page, pageSize, search } = query;

    let where: FilterQuery<Category> = {};
    if (search) {
      where = deepMerge(where, {
        $or: [{ name: { $ilike: `%${search}%` } }, { code: { $ilike: `%${search}%` } }],
      });
    }

    const [categories, total] = await this.categoryRepo.findAndCount(where, {
      limit: pageSize,
      offset: (page - 1) * pageSize,
      orderBy: { createdAt: "desc" },
    });

    return {
      data: categories.map((category) => this._toResponse(category)),
      metadata: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    };
  }

  @Transactional()
  async update(categoryId: Uuid, body: UpdateCategory): Promise<CategoryResponse> {
    const category = await this.categoryRepo.findOne({ id: categoryId });
    if (!category) throw new NotFoundException(`Category ${categoryId} not found`);

    this.categoryRepo.assign(category, body);
    await this.em.flush();

    return this._toResponse(category);
  }

  @Transactional()
  async delete(categoryId: Uuid): Promise<void> {
    const category = await this.categoryRepo.findOne({ id: categoryId });
    if (!category) throw new NotFoundException(`Category ${categoryId} not found`);

    this.em.remove(category);
  }

  protected override _toResponse(category: Loaded<Category>): CategoryResponse {
    return wrap(category).serialize();
  }

  protected override _toDetailResponse(category: Loaded<Category>): CategoryResponse {
    return wrap(category).serialize();
  }
}
