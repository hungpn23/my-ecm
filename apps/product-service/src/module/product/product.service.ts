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
import { EntityManager, type FilterQuery } from "@mikro-orm/postgresql";
import { AuthenticationContext } from "@nestjs/authentication";
import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class ProductService {
  constructor(
    private readonly em: EntityManager,
    private readonly authCtx: AuthenticationContext,
  ) {}

  async create(body: CreateProduct): Promise<ProductDetailResponse> {
    return await this.em.transactional(async (em) => {
      const shopId = this.requireShopId();
      const { categoryId, ...rest } = body;

      const category = await em.findOne(Category, { id: categoryId });
      if (!category) throw new NotFoundException(`Category ${categoryId} not found`);

      const newProduct = em.create(Product, {
        ...rest,
        description: rest.description,
        category,
        shopId,
      });
      const product = await em.populate(newProduct, ["category", "description"]);

      return product.toDetailResponse();
    });
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

    const [products, total] = await this.em.findAndCount(Product, where, {
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
    const product = await this.em.findOne(
      Product,
      { id: productId, shopId },
      { populate: ["category", "description"] },
    );
    if (!product) throw new NotFoundException(`Product ${productId} not found`);

    return product.toDetailResponse();
  }

  async update(productId: Uuid, body: UpdateProduct): Promise<ProductDetailResponse> {
    return await this.em.transactional(async (em) => {
      const shopId = this.requireShopId();
      const product = await em.findOne(
        Product,
        { id: productId, shopId },
        { populate: ["category", "description"] },
      );
      if (!product) throw new NotFoundException(`Product ${productId} not found`);

      const { categoryId, ...data } = body;

      if (categoryId) {
        const category = await em.findOne(Category, { id: categoryId });
        if (!category) throw new NotFoundException(`Category ${categoryId} not found`);

        em.assign(product, { category });
      }

      em.assign(product, data);

      await em.flush();

      return product.toDetailResponse();
    });
  }

  async delete(productId: Uuid): Promise<void> {
    await this.em.transactional(async (em) => {
      const shopId = this.requireShopId();
      const product = await em.findOne(Product, { id: productId, shopId });
      if (!product) throw new NotFoundException(`Product ${productId} not found`);

      em.remove(product);
    });
  }

  private requireShopId(): Uuid {
    const { shopId, shopRole } = this.authCtx.requireUser();
    if (!shopId || !shopRole) throw new ForbiddenException("User is not a seller");

    return shopId;
  }
}
