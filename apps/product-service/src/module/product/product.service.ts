import { deepMerge, type OffsetQuery } from "@libs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository, wrap, type FilterQuery } from "@mikro-orm/postgresql";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Category, OutboxEvent, Product } from "@src/database/entity";
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
    const response = this._toResponse(product);

    this.em.create(OutboxEvent, {
      aggregateType: "product",
      aggregateId: product.id,
      eventType: "product.created",
      payload: response,
    });

    await this.em.flush();

    return response;
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
      populate: ["category"],
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
    const product = await this.productRepo.findOne({ id: productId }, { populate: ["category"] });
    if (!product) throw new NotFoundException(`Product ${productId} not found`);

    return this._toResponse(product);
  }

  async update(productId: string, body: UpdateProduct): Promise<ProductResponse> {
    const product = await this.productRepo.findOne({ id: productId }, { populate: ["category"] });
    if (!product) throw new NotFoundException(`Product ${productId} not found`);

    const { categoryId, ...data } = body;

    if (categoryId) {
      const category = await this.categoryRepo.findOne({ id: categoryId });
      if (!category) throw new NotFoundException(`Category ${categoryId} not found`);

      product.category = category;
    }

    this.productRepo.assign(product, data);

    const response = this._toResponse(product);

    this.em.create(OutboxEvent, {
      aggregateType: "product",
      aggregateId: product.id,
      eventType: "product.updated",
      payload: response,
    });

    await this.em.flush();

    return response;
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
