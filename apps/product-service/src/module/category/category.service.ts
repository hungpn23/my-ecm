import { deepMerge } from "@libs/common";
import {
  type Category,
  type CreateCategory,
  type OffsetQuery,
  type PaginatedCategoryResponse,
  type UpdateCategory,
  Uuid,
} from "@libs/contract";
import { EntityManager, type FilterQuery } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";

import { CategoryEntity } from "#internal/database/entity/index";

@Injectable()
export class CategoryService {
  constructor(private readonly em: EntityManager) {}

  async create(body: CreateCategory): Promise<Category> {
    return await this.em.transactional(async (em) => {
      const category = em.create(CategoryEntity, body);

      return category.toDetailResponse();
    });
  }

  async find(query: OffsetQuery): Promise<PaginatedCategoryResponse> {
    const { page, pageSize, search } = query;

    let where: FilterQuery<CategoryEntity> = {};
    if (search) {
      where = deepMerge(where, {
        $or: [{ name: { $ilike: `%${search}%` } }, { code: { $ilike: `%${search}%` } }],
      });
    }

    const [categories, total] = await this.em.findAndCount(CategoryEntity, where, {
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

  async update(categoryId: Uuid, body: UpdateCategory): Promise<Category> {
    return await this.em.transactional(async (em) => {
      const category = await em.findOneOrFail(CategoryEntity, {
        id: categoryId,
      });

      em.assign(category, body);
      await em.flush();

      return category.toDetailResponse();
    });
  }

  async delete(categoryId: Uuid): Promise<void> {
    await this.em.transactional(async (em) => {
      const category = await em.findOneOrFail(CategoryEntity, {
        id: categoryId,
      });

      em.remove(category);
    });
  }
}
