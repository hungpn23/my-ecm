import { CategoryEntity, ProductEntity } from "#internal/database/entity/index";
import { deepMerge } from "@libs/common";
import {
  type CreateProduct,
  type OffsetQuery,
  type PaginatedProductResponse,
  type ProductDetailResponse,
  type UpdateProduct,
  type Uuid,
} from "@libs/contract";
import { SellerContext } from "@libs/core";
import { EntityManager, type FilterQuery } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductService {
  constructor(
    private readonly em: EntityManager,
    private readonly sellerContext: SellerContext,
  ) {}

  async create(body: CreateProduct): Promise<ProductDetailResponse> {
    return await this.em.transactional(async (em) => {
      const shopId = this.sellerContext.shopId;
      const { categoryId, ...rest } = body;

      const category = await em.findOneOrFail(CategoryEntity, { id: categoryId });

      const newProduct = em.create(ProductEntity, {
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
    const shopId = this.sellerContext.shopId;
    const { page, pageSize, search } = query;

    let where: FilterQuery<ProductEntity> = { shopId };
    if (search) {
      where = deepMerge(where, {
        $or: [{ name: { $ilike: `%${search}%` } }],
      });
    }

    const [products, total] = await this.em.findAndCount(ProductEntity, where, {
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
    const shopId = this.sellerContext.shopId;
    const product = await this.em.findOneOrFail(
      ProductEntity,
      { id: productId, shopId },
      { populate: ["category", "description"] },
    );

    return product.toDetailResponse();
  }

  async update(productId: Uuid, body: UpdateProduct): Promise<ProductDetailResponse> {
    return await this.em.transactional(async (em) => {
      const shopId = this.sellerContext.shopId;
      const product = await em.findOneOrFail(
        ProductEntity,
        { id: productId, shopId },
        { populate: ["category", "description"] },
      );

      const { categoryId, ...data } = body;

      if (categoryId) {
        const category = await em.findOneOrFail(CategoryEntity, { id: categoryId });

        em.assign(product, { category });
      }

      em.assign(product, data);

      await em.flush();

      return product.toDetailResponse();
    });
  }

  async delete(productId: Uuid): Promise<void> {
    await this.em.transactional(async (em) => {
      const shopId = this.sellerContext.shopId;
      const product = await em.findOneOrFail(ProductEntity, { id: productId, shopId });

      em.remove(product);
    });
  }
}
