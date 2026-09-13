import { deepMerge, type OffsetQuery } from "@libs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository, wrap, type FilterQuery } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { Category } from "@src/database/entity";
import type {
  CategoryResponse,
  CreateCategory,
  PaginatedCategoryResponse,
} from "./category.schema";

@Injectable()
export class CategoryService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Category)
    private readonly categoryRepo: EntityRepository<Category>,
  ) {}

  async create(body: CreateCategory): Promise<CategoryResponse> {
    const category = this.categoryRepo.create(body);
    await this.em.flush();

    return wrap(category).toObject();
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
      data: categories.map((category) => wrap(category).toObject()),
      metadata: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    };
  }
}
