import { deepMerge, type OffsetQuery } from "@libs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository, wrap, type FilterQuery } from "@mikro-orm/postgresql";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Category } from "@src/database/entity";
import type {
  CategoryResponse,
  CreateCategory,
  PaginatedCategoryResponse,
  UpdateCategory,
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

  async update(categoryId: string, body: UpdateCategory): Promise<CategoryResponse> {
    const category = await this.categoryRepo.findOne({ id: categoryId });
    if (!category) throw new NotFoundException(`Category ${categoryId} not found`);

    this.categoryRepo.assign(category, body);
    await this.em.flush();

    return this._toResponse(category);
  }

  async delete(categoryId: string): Promise<void> {
    const category = await this.categoryRepo.findOne({ id: categoryId });
    if (!category) throw new NotFoundException(`Category ${categoryId} not found`);

    this.em.remove(category);
    await this.em.flush();
  }

  private _toResponse(category: Category): CategoryResponse {
    return wrap(category).toObject();
  }
}
