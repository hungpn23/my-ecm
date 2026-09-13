import { deepMerge, type OffsetQuery } from "@libs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository, wrap, type FilterQuery } from "@mikro-orm/postgresql";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Category, Product } from "@src/database/entity";
import type {
  CreateProduct,
  PaginatedProductResponse,
  ProductResponse,
  UpdateProduct,
} from "./product.schema";

@Injectable()
export class ProductService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Category)
    private readonly categoryRepo: EntityRepository<Category>,
    @InjectRepository(Product)
    private readonly productRepo: EntityRepository<Product>,
  ) {}

  async create(body: CreateProduct): Promise<ProductResponse> {
    const { categoryId, ...rest } = body;

    const category = await this.categoryRepo.findOne({ id: categoryId });
    if (!category) throw new NotFoundException(`Category ${categoryId} not found`);

    const product = this.productRepo.create({ ...rest, category });
    await this.em.flush();

    return this._toResponse(product);
  }

  async find(query: OffsetQuery): Promise<PaginatedProductResponse> {
    const { page, pageSize, search } = query;

    let where: FilterQuery<Product> = {};
    if (search) {
      where = deepMerge(where, {
        $or: [{ name: { $ilike: `%${search}%` } }],
      });
    }

    const [products, total] = await this.productRepo.findAndCount(where, {
      limit: pageSize,
      offset: (page - 1) * pageSize,
      orderBy: { createdAt: "desc" },
    });

    return {
      data: products.map((product) => this._toResponse(product)),
      metadata: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    };
  }

  async findOne(productId: string): Promise<ProductResponse> {
    const product = await this.productRepo.findOne({ id: productId });
    if (!product) throw new NotFoundException(`Product ${productId} not found`);

    return this._toResponse(product);
  }

  async update(productId: string, body: UpdateProduct): Promise<ProductResponse> {
    const product = await this.productRepo.findOne({ id: productId });
    if (!product) throw new NotFoundException(`Product ${productId} not found`);

    const { categoryId, ...data } = body;
    const category = categoryId ? await this.categoryRepo.findOne({ id: categoryId }) : undefined;
    if (categoryId && !category) throw new NotFoundException(`Category ${categoryId} not found`);

    this.productRepo.assign(product, data);
    if (category) this.productRepo.assign(product, { category });
    await this.em.flush();

    return this._toResponse(product);
  }

  async delete(productId: string): Promise<void> {
    const product = await this.productRepo.findOne({ id: productId });
    if (!product) throw new NotFoundException(`Product ${productId} not found`);

    this.em.remove(product);
    await this.em.flush();
  }

  private _toResponse(product: Product): ProductResponse {
    const { category, ...data } = wrap(product).toObject();

    return {
      ...data,
      description: data.description ?? null,
      categoryId: category.id,
    };
  }
}
