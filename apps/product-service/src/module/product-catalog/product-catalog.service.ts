import {
  type PaginatedProductResponse,
  type ProductCatalogQuery,
  ProductCatalogSort,
  type ProductDetail,
  type Uuid,
} from "@libs/contract";
import { EntityManager, type FilterQuery, type QueryOrderMap } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";

import { ProductEntity } from "#internal/database/entity/index";

@Injectable()
export class ProductCatalogService {
  constructor(private readonly em: EntityManager) {}

  async find(query: ProductCatalogQuery): Promise<PaginatedProductResponse> {
    const { page, pageSize, sort } = query;

    const [products, total] = await this.em.findAndCount(ProductEntity, this._toWhere(query), {
      populate: ["category"],
      limit: pageSize,
      offset: (page - 1) * pageSize,
      orderBy: this._toOrderBy(sort),
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

  async findOne(productId: Uuid): Promise<ProductDetail> {
    const product = await this.em.findOneOrFail(
      ProductEntity,
      { id: productId, status: "ACTIVE" },
      { populate: ["category", "description"] },
    );

    return product.toDetailResponse();
  }

  private _toWhere({ search, categoryId, minPrice, maxPrice }: ProductCatalogQuery): FilterQuery<ProductEntity> {
    const where: FilterQuery<ProductEntity>[] = [{ status: "ACTIVE" }];

    if (search) where.push({ name: { $ilike: `%${search}%` } });
    if (categoryId) where.push({ category: categoryId });
    if (minPrice) where.push({ price: { $gte: minPrice } });
    if (maxPrice) where.push({ price: { $lte: maxPrice } });

    return { $and: where };
  }

  private _toOrderBy(sort: ProductCatalogSort): QueryOrderMap<ProductEntity> {
    switch (sort) {
      case "price_asc":
        return { price: "ASC", id: "ASC" };
      case "price_desc":
        return { price: "DESC", id: "ASC" };
      case "name_asc":
        return { name: "ASC", id: "ASC" };
      case "newest":
        return { createdAt: "DESC", id: "DESC" };
      default:
        return { id: "ASC" };
    }
  }
}
