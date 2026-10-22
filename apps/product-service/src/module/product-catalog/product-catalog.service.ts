import {
  type PaginatedProductResponse,
  type ProductCatalogQuery,
  ProductCatalogSort,
  type ProductDetail,
  type Uuid,
} from "@libs/contract";
import { EntityManager, type FilterQuery, type QueryOrderMap } from "@mikro-orm/postgresql";
import { BadRequestException, Injectable } from "@nestjs/common";

import { ProductEntity } from "#internal/database/entity/index";

@Injectable()
export class ProductCatalogService {
  constructor(private readonly em: EntityManager) {}

  async find(query: ProductCatalogQuery): Promise<PaginatedProductResponse> {
    const { page, pageSize, search, categoryId, minPrice, maxPrice, sort } = query;

    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
      throw new BadRequestException("minPrice must not be greater than maxPrice");
    }

    const conditions: FilterQuery<ProductEntity>[] = [{ status: "ACTIVE" }];

    if (search) {
      conditions.push({ name: { $ilike: `%${this._escapeLike(search)}%` } });
    }

    if (categoryId) {
      conditions.push({ category: categoryId });
    }

    if (minPrice) {
      conditions.push({ price: { $gte: minPrice } });
    }

    if (maxPrice) {
      conditions.push({ price: { $lte: maxPrice } });
    }

    const [products, total] = await this.em.findAndCount(
      ProductEntity,
      { $and: conditions },
      {
        populate: ["category"],
        limit: pageSize,
        offset: (page - 1) * pageSize,
        orderBy: this._toOrderBy(sort),
      },
    );

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
    }
  }

  private _escapeLike(value: string): string {
    return value.replace(/[\\%_]/g, (char) => `\\${char}`);
  }
}
