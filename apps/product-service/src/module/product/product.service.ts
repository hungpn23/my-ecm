import { Category, Product } from "#internal/database/entity/index";
import { deepMerge } from "@libs/common";
import {
  type CreateProduct,
  type OffsetQuery,
  type PaginatedProductResponse,
  type ProductDetailResponse,
  type UpdateProduct,
  type Uuid,
} from "@libs/contract";
import { OutboxService } from "@libs/core";
import { Transactional } from "@mikro-orm/decorators/legacy";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository, type FilterQuery } from "@mikro-orm/postgresql";
import { AuthenticationContext } from "@nestjs/authentication";
import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class ProductService {
  constructor(
    private readonly em: EntityManager,
    private readonly outboxService: OutboxService,
    @InjectRepository(Category)
    private readonly categoryRepo: EntityRepository<Category>,
    @InjectRepository(Product)
    private readonly productRepo: EntityRepository<Product>,
    private readonly authCtx: AuthenticationContext,
  ) {}

  @Transactional()
  async create(body: CreateProduct): Promise<ProductDetailResponse> {
    const shopId = this.requireShopId();
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

  async find(query: OffsetQuery): Promise<PaginatedProductResponse> {
    const shopId = this.requireShopId();
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

  async findOne(productId: Uuid): Promise<ProductDetailResponse> {
    const shopId = this.requireShopId();
    const product = await this.productRepo.findOne(
      { id: productId, shopId },
      { populate: ["category", "description"] },
    );
    if (!product) throw new NotFoundException(`Product ${productId} not found`);

    return product.toDetailResponse();
  }

  @Transactional()
  async update(productId: Uuid, body: UpdateProduct): Promise<ProductDetailResponse> {
    const shopId = this.requireShopId();
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
  async delete(productId: Uuid): Promise<void> {
    const shopId = this.requireShopId();
    const product = await this.productRepo.findOne({ id: productId, shopId });
    if (!product) throw new NotFoundException(`Product ${productId} not found`);

    this.em.remove(product);
  }

  private requireShopId(): Uuid {
    const { shopId, shopRole } = this.authCtx.requireUser();
    if (!shopId || !shopRole) throw new ForbiddenException("User is not a seller");

    return shopId;
  }
}
