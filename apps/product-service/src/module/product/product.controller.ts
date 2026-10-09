import { Endpoint } from "@libs/common";
import {
  CreateProduct,
  OffsetQuery,
  PaginatedProductResponse,
  ProductDetailResponse,
  UpdateProduct,
  Uuid,
} from "@libs/contract";
import { SellerGuard } from "@libs/core";
import { Body, Controller, Param, Query, UseGuards } from "@nestjs/common";
import { ProductService } from "./product.service";

@UseGuards(SellerGuard)
@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Endpoint("POST", { request: CreateProduct, response: ProductDetailResponse })
  async create(
    @Body({ schema: CreateProduct }) body: CreateProduct,
  ): Promise<ProductDetailResponse> {
    return await this.productService.create(body);
  }

  @Endpoint("GET", { query: OffsetQuery, response: PaginatedProductResponse })
  async find(
    @Query({ schema: OffsetQuery }) query: OffsetQuery,
  ): Promise<PaginatedProductResponse> {
    return await this.productService.find(query);
  }

  @Endpoint("GET", { path: ":productId", response: ProductDetailResponse })
  async findOne(
    @Param("productId", { schema: Uuid }) productId: Uuid,
  ): Promise<ProductDetailResponse> {
    return await this.productService.findOne(productId);
  }

  @Endpoint("PATCH", {
    path: ":productId",
    request: UpdateProduct,
    response: ProductDetailResponse,
  })
  async update(
    @Param("productId", { schema: Uuid }) productId: Uuid,
    @Body({ schema: UpdateProduct }) body: UpdateProduct,
  ): Promise<ProductDetailResponse> {
    return await this.productService.update(productId, body);
  }

  @Endpoint("DELETE", { path: ":productId" })
  async delete(@Param("productId", { schema: Uuid }) productId: Uuid): Promise<void> {
    await this.productService.delete(productId);
  }
}
