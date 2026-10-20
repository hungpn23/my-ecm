import { Endpoint } from "@libs/common";
import {
  CreateProduct,
  OffsetQuery,
  PaginatedProductResponse,
  ProductDetail,
  UpdateProduct,
  Uuid,
} from "@libs/contract";
import { Body, Controller, Param, Query } from "@nestjs/common";
import { ProductService } from "./product.service";

@Controller("products")
export class ProductController {
  constructor(private readonly product: ProductService) {}

  @Endpoint("POST", { request: CreateProduct, response: ProductDetail })
  async create(@Body({ schema: CreateProduct }) body: CreateProduct): Promise<ProductDetail> {
    return await this.product.create(body);
  }

  @Endpoint("GET", { query: OffsetQuery, response: PaginatedProductResponse })
  async find(
    @Query({ schema: OffsetQuery }) query: OffsetQuery,
  ): Promise<PaginatedProductResponse> {
    return await this.product.find(query);
  }

  @Endpoint("GET", { path: ":productId", response: ProductDetail })
  async findOne(@Param("productId", { schema: Uuid }) productId: Uuid): Promise<ProductDetail> {
    return await this.product.findOne(productId);
  }

  @Endpoint("PATCH", {
    path: ":productId",
    request: UpdateProduct,
    response: ProductDetail,
  })
  async update(
    @Param("productId", { schema: Uuid }) productId: Uuid,
    @Body({ schema: UpdateProduct }) body: UpdateProduct,
  ): Promise<ProductDetail> {
    return await this.product.update(productId, body);
  }

  @Endpoint("DELETE", { path: ":productId" })
  async delete(@Param("productId", { schema: Uuid }) productId: Uuid): Promise<void> {
    await this.product.delete(productId);
  }
}
