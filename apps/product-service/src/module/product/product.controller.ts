import { Endpoint } from "@libs/common";
import {
  CreateProduct,
  OffsetQuery,
  PaginatedProductResponse,
  ProductDetailResponse,
  UpdateProduct,
  Uuid,
} from "@libs/contract";
import { Seller, SellerGuard } from "@libs/core";
import { Body, Controller, Param, Query, UseGuards } from "@nestjs/common";
import { ProductService } from "./product.service";

@UseGuards(SellerGuard)
@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Endpoint("POST", { request: CreateProduct, response: ProductDetailResponse })
  async create(
    @Seller("shopId") shopId: Uuid,
    @Body({ schema: CreateProduct }) body: CreateProduct,
  ): Promise<ProductDetailResponse> {
    return await this.productService.create(shopId, body);
  }

  @Endpoint("GET", { query: OffsetQuery, response: PaginatedProductResponse })
  async find(
    @Seller("shopId") shopId: Uuid,
    @Query({ schema: OffsetQuery }) query: OffsetQuery,
  ): Promise<PaginatedProductResponse> {
    return await this.productService.find(shopId, query);
  }

  @Endpoint("GET", { path: ":productId", response: ProductDetailResponse })
  async findOne(
    @Seller("shopId") shopId: Uuid,
    @Param("productId", { schema: Uuid }) productId: Uuid,
  ): Promise<ProductDetailResponse> {
    return await this.productService.findOne(shopId, productId);
  }

  @Endpoint("PATCH", {
    path: ":productId",
    request: UpdateProduct,
    response: ProductDetailResponse,
  })
  async update(
    @Seller("shopId") shopId: Uuid,
    @Param("productId", { schema: Uuid }) productId: Uuid,
    @Body({ schema: UpdateProduct }) body: UpdateProduct,
  ): Promise<ProductDetailResponse> {
    return await this.productService.update(shopId, productId, body);
  }

  @Endpoint("DELETE", { path: ":productId" })
  async delete(
    @Seller("shopId") shopId: Uuid,
    @Param("productId", { schema: Uuid }) productId: Uuid,
  ): Promise<void> {
    await this.productService.delete(shopId, productId);
  }
}
