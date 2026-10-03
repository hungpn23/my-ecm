import { Category, Product } from "#internal/database/entity/index";
import { deepMerge, Uuid, type OffsetQuery } from "@libs/common";
import { OutboxService } from "@libs/core";
import { Transactional } from "@mikro-orm/decorators/legacy";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository, type FilterQuery } from "@mikro-orm/postgresql";
import { Injectable, NotFoundException } from "@nestjs/common";
import type {
  CreateProduct,
  PaginatedProductResponse,
  ProductDetailResponse,
  UpdateProduct,
} from "./product.schema";

@Injectable()
export class ProductService {
  constructor(
    private readonly em: EntityManager,
    private readonly outboxService: OutboxService,
    @InjectRepository(Category)
    private readonly categoryRepo: EntityRepository<Category>,
    @InjectRepository(Product)
    private readonly productRepo: EntityRepository<Product>,
  ) {}

  @Transactional()
  async create(shopId: Uuid, body: CreateProduct): Promise<ProductDetailResponse> {
    const { categoryId, ...rest } = body;

    const category = await this.categoryRepo.findOne({ id: categoryId });
    if (!category) throw new NotFoundException(`Category ${categoryId} not found`);

    const newProduct = this.productRepo.create({
      ...rest,
      description: rest.description,
      category,
      shopId,
    });
    const product = await this.em.populate(newProduct, ["category", "description"]);
    const response = product.toDetailResponse();

    await this.outboxService.createAndFlush({
      aggregateType: "Product",
      aggregateId: product.id,
      eventType: "product.created",
      payload: response,
    });

    return response;
  }

  async find(shopId: Uuid, query: OffsetQuery): Promise<PaginatedProductResponse> {
    const { page, pageSize, search } = query;

    let where: FilterQuery<Product> = { shopId };
    if (search) {
      where = deepMerge(where, {
        $or: [{ name: { $ilike: `%${search}%` } }],
      });
    }

    const [products, total] = await this.productRepo.findAndCount(where, {
      populate: ["category"],
      limit: pageSize,
      offset: (page - 1) * pageSize,
      orderBy: { createdAt: "DESC" },
    });

    return {
      data: products.map((product) => product.toResponse()),
      metadata: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    };
  }

  async findOne(shopId: Uuid, productId: Uuid): Promise<ProductDetailResponse> {
    const product = await this.productRepo.findOne(
      { id: productId, shopId },
      { populate: ["category", "description"] },
    );
    if (!product) throw new NotFoundException(`Product ${productId} not found`);

    return product.toDetailResponse();
  }

  @Transactional()
  async update(shopId: Uuid, productId: Uuid, body: UpdateProduct): Promise<ProductDetailResponse> {
    const product = await this.productRepo.findOne(
      { id: productId, shopId },
      { populate: ["category", "description"] },
    );
    if (!product) throw new NotFoundException(`Product ${productId} not found`);

    const { categoryId, ...data } = body;

    if (categoryId) {
      const category = await this.categoryRepo.findOne({ id: categoryId });
      if (!category) throw new NotFoundException(`Category ${categoryId} not found`);

      this.productRepo.assign(product, { category });
    }

    this.productRepo.assign(product, data);

    await this.em.flush();

    const response = product.toDetailResponse();

    await this.outboxService.createAndFlush({
      aggregateType: "Product",
      aggregateId: product.id,
      eventType: "product.updated",
      payload: response,
    });

    return response;
  }

  @Transactional()
  async delete(shopId: Uuid, productId: Uuid): Promise<void> {
    const product = await this.productRepo.findOne({ id: productId, shopId });
    if (!product) throw new NotFoundException(`Product ${productId} not found`);

    this.em.remove(product);
  }
}
