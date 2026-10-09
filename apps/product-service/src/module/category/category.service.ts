import { Category } from "#internal/database/entity/index";
import { deepMerge } from "@libs/common";
import {
  Uuid,
  type CategoryResponse,
  type CreateCategory,
  type OffsetQuery,
  type PaginatedCategoryResponse,
  type UpdateCategory,
} from "@libs/contract";
import { EntityManager, type FilterQuery } from "@mikro-orm/postgresql";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class CategoryService {
  constructor(private readonly em: EntityManager) {}

  async create(body: CreateCategory): Promise<CategoryResponse> {
    return this.em.transactional(async (em) => {
      const category = em.create(Category, body);

      return category.toDetailResponse();
    });
  }

  async find(query: OffsetQuery): Promise<PaginatedCategoryResponse> {
    const { page, pageSize, search } = query;

    let where: FilterQuery<Category> = {};
    if (search) {
      where = deepMerge(where, {
        $or: [{ name: { $ilike: `%${search}%` } }, { code: { $ilike: `%${search}%` } }],
      });
    }

    const [categories, total] = await this.em.findAndCount(Category, where, {
      limit: pageSize,
      offset: (page - 1) * pageSize,
      orderBy: { createdAt: "desc" },
    });

    return {
      data: categories.map((category) => category.toResponse()),
      metadata: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    };
  }

  async update(categoryId: Uuid, body: UpdateCategory): Promise<CategoryResponse> {
    return this.em.transactional(async (em) => {
      const category = await em.findOne(Category, { id: categoryId });
      if (!category) throw new NotFoundException(`Category ${categoryId} not found`);

      em.assign(category, body);
      await em.flush();

      return category.toDetailResponse();
    });
  }

  async delete(categoryId: Uuid): Promise<void> {
    await this.em.transactional(async (em) => {
      const category = await em.findOne(Category, { id: categoryId });
      if (!category) throw new NotFoundException(`Category ${categoryId} not found`);

      em.remove(category);
    });
  }
}
